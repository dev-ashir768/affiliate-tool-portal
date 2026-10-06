import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  clearAccessCookieOptions,
  clearRefreshCookieOptions,
  getApiBaseUrl,
  requirePortalBffSecret,
  refreshCookieOptions,
} from "@/lib/auth/constants";
import {
  defaultRedirectForClaims,
  inspectAccessToken,
  verifyAccessClaims,
} from "@/lib/auth/access-token";
import {
  classifyRoute,
  isProtectedRoute,
  isSubscriptionExemptPath,
  type RouteClass,
} from "@/lib/auth/route-policy";

type RotateResult =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; reason: "unauthorized" | "misconfigured" | "error" };

async function rotateTokens(refreshToken: string): Promise<RotateResult> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Portal-Bff-Secret": requirePortalBffSecret(),
    };

    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "unauthorized" };
    }
    if (!res.ok) return { ok: false, reason: "error" };
    const data = (await res.json()) as {
      accessToken: string;
      refreshToken?: string;
    };
    if (!data.accessToken || !data.refreshToken) {
      console.error(
        "[proxy] refresh response missing tokens — PORTAL_BFF_SECRET likely differs from APIs",
      );
      return { ok: false, reason: "misconfigured" };
    }
    const inspected = await inspectAccessToken(data.accessToken);
    if (inspected.status !== "valid") {
      console.error(
        "[proxy] refreshed access token failed verification — JWT_ACCESS_SECRET likely differs from APIs",
      );
      return { ok: false, reason: "misconfigured" };
    }
    return {
      ok: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (err) {
    console.error("[proxy] token refresh failed", err);
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("PORTAL_BFF_SECRET") ||
      message.includes("JWT_ACCESS_SECRET")
    ) {
      return { ok: false, reason: "misconfigured" };
    }
    return { ok: false, reason: "error" };
  }
}

function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    accessCookieOptions()
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    refreshCookieOptions()
  );
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...clearAccessCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
}

function copySessionCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

async function redirectAuthedAwayFromAuth(
  request: NextRequest,
  accessToken: string
): Promise<NextResponse> {
  const claims = await verifyAccessClaims(accessToken);
  if (!claims) {
    const login = NextResponse.redirect(new URL("/login", request.url));
    clearSessionCookies(login);
    return login;
  }
  return NextResponse.redirect(
    new URL(defaultRedirectForClaims(claims), request.url)
  );
}

/**
 * Area guards after a verified session token is available.
 * - staff (platformRole) → /backoffice/* only
 * - merchant (orgId, no platformRole) → product routes only
 */
async function enforceAreaAccess(
  request: NextRequest,
  accessToken: string,
  kind: RouteClass,
  response: NextResponse
): Promise<NextResponse> {
  const claims = await verifyAccessClaims(accessToken);
  if (!claims) {
    const login = redirectToLogin(request, request.nextUrl.pathname);
    clearSessionCookies(login);
    return login;
  }

  const { pathname } = request.nextUrl;
  const isStaff = Boolean(claims.platformRole);
  const isMerchant = Boolean(claims.orgId) && !isStaff;

  if (kind === "staff") {
    if (!isStaff) {
      return NextResponse.redirect(
        new URL(claims.hasProductAccess ? "/home" : "/onboarding", request.url)
      );
    }
    return response;
  }

  if (kind === "merchant") {
    if (isStaff) {
      return NextResponse.redirect(new URL("/backoffice/users", request.url));
    }
    if (!isMerchant) {
      const login = redirectToLogin(request, pathname);
      clearSessionCookies(login);
      return login;
    }

    const hasAccess = claims.hasProductAccess;
    if (!hasAccess && !isSubscriptionExemptPath(pathname)) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (
      hasAccess &&
      (pathname === "/onboarding" || pathname.startsWith("/onboarding/"))
    ) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return response;
  }

  return response;
}

/**
 * Prefer a valid (signature-verified) access token; otherwise rotate via refresh.
 * Never rotate on JWT secret mismatch — that burns the refresh token while
 * discarding the new pair and causes login→logout loops.
 */
async function ensureAccessToken(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{
  accessToken: string | null;
  sessionResponse: NextResponse | null;
  cleared: boolean;
  misconfigured: boolean;
}> {
  if (accessToken) {
    const inspected = await inspectAccessToken(accessToken);
    if (inspected.status === "valid") {
      return {
        accessToken,
        sessionResponse: null,
        cleared: false,
        misconfigured: false,
      };
    }
    if (inspected.status === "misconfigured") {
      console.error(
        "[proxy] access token unusable — JWT_ACCESS_SECRET missing or differs from APIs",
      );
      return {
        accessToken: null,
        sessionResponse: null,
        cleared: false,
        misconfigured: true,
      };
    }
    // expired or invalid signature/malformed → try refresh below when available
    if (inspected.status === "invalid" && !refreshToken) {
      return {
        accessToken: null,
        sessionResponse: null,
        cleared: true,
        misconfigured: false,
      };
    }
  }

  if (!refreshToken) {
    return {
      accessToken: null,
      sessionResponse: null,
      cleared: Boolean(accessToken),
      misconfigured: false,
    };
  }

  const rotated = await rotateTokens(refreshToken);
  if (!rotated.ok) {
    return {
      accessToken: null,
      sessionResponse: null,
      // Only wipe cookies when the refresh token itself is rejected.
      cleared: rotated.reason === "unauthorized",
      misconfigured: rotated.reason === "misconfigured",
    };
  }

  const sessionResponse = NextResponse.next();
  applySessionCookies(sessionResponse, rotated);
  return {
    accessToken: rotated.accessToken,
    sessionResponse,
    cleared: false,
    misconfigured: false,
  };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const kind = classifyRoute(pathname);

  try {
    const rawAccess = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (kind === "entry") {
      const ensured = await ensureAccessToken(rawAccess, refreshToken);
      if (ensured.accessToken) {
        const response = await redirectAuthedAwayFromAuth(
          request,
          ensured.accessToken
        );
        if (ensured.sessionResponse) {
          copySessionCookies(ensured.sessionResponse, response);
        }
        return response;
      }
      const login = NextResponse.redirect(new URL("/login", request.url));
      if (ensured.cleared) clearSessionCookies(login);
      return login;
    }

    if (isProtectedRoute(kind)) {
      const ensured = await ensureAccessToken(rawAccess, refreshToken);

      if (!ensured.accessToken) {
        const login = redirectToLogin(request, pathname);
        // Keep cookies on JWT/BFF misconfig so ops can fix secrets without
        // forcing a dead refresh-token rotate loop.
        if (ensured.cleared && !ensured.misconfigured) {
          clearSessionCookies(login);
        }
        return login;
      }

      const base = ensured.sessionResponse ?? NextResponse.next();
      return enforceAreaAccess(request, ensured.accessToken, kind, base);
    }

    if (kind === "guest_auth") {
      const ensured = await ensureAccessToken(rawAccess, refreshToken);
      if (ensured.accessToken) {
        const response = await redirectAuthedAwayFromAuth(
          request,
          ensured.accessToken
        );
        if (ensured.sessionResponse) {
          copySessionCookies(ensured.sessionResponse, response);
        }
        return response;
      }
      if (ensured.cleared) {
        const response = NextResponse.next();
        clearSessionCookies(response);
        return response;
      }
    }

    return NextResponse.next();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[proxy] unexpected error", message);
    // Config errors (missing secrets) — do not wipe cookies; surface as login redirect only.
    const isConfigError =
      message.includes("PORTAL_BFF_SECRET") ||
      message.includes("JWT_ACCESS_SECRET");
    if (isProtectedRoute(kind) || kind === "entry") {
      const login = redirectToLogin(request, pathname);
      if (!isConfigError) clearSessionCookies(login);
      return login;
    }
    return NextResponse.next();
  }
}

/**
 * Run on all app navigations. Skip API, Next internals, and static assets.
 */
export const config = {
  matcher: [
    "/",
    "/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
