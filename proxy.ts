import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  clearAccessCookieOptions,
  clearRefreshCookieOptions,
  refreshCookieOptions,
} from "@/lib/auth/constants";
import {
  defaultRedirectForClaims,
  inspectAccessToken,
  secondsUntilExpiry,
  verifyAccessClaims,
} from "@/lib/auth/access-token";
import { rotateSessionTokens } from "@/lib/auth/rotate";
import { clientIpFromHeaders } from "@/lib/auth/client-ip";
import {
  classifyRoute,
  isProtectedRoute,
  isSubscriptionExemptPath,
  type RouteClass,
} from "@/lib/auth/route-policy";

function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    accessCookieOptions(secondsUntilExpiry(tokens.accessToken))
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
  request: NextRequest,
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
        "[proxy] access token unusable — JWT_PUBLIC_KEY / JWT_ACCESS_SECRET missing or differs from APIs",
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

  const rotated = await rotateSessionTokens(refreshToken, {
    accessToken,
    clientIp: clientIpFromHeaders(request.headers),
  });
  if (!rotated.ok) {
    return {
      accessToken: null,
      sessionResponse: null,
      // Only wipe cookies when the refresh token itself is rejected.
      cleared: rotated.reason === "unauthorized",
      misconfigured: rotated.reason === "misconfigured",
    };
  }

  // Forward the new pair to this request too, so layouts rendered downstream
  // read the fresh access token instead of the expired one.
  request.cookies.set(ACCESS_TOKEN_COOKIE, rotated.accessToken);
  request.cookies.set(REFRESH_TOKEN_COOKIE, rotated.refreshToken);
  const sessionResponse = NextResponse.next({
    request: { headers: request.headers },
  });
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
      const ensured = await ensureAccessToken(request, rawAccess, refreshToken);
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
      const ensured = await ensureAccessToken(request, rawAccess, refreshToken);

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
      const response = await enforceAreaAccess(
        request,
        ensured.accessToken,
        kind,
        base
      );
      // Area redirects build a fresh response — keep the rotated pair, or the
      // browser would retry with the now-revoked refresh token.
      if (ensured.sessionResponse && response !== base) {
        copySessionCookies(ensured.sessionResponse, response);
      }
      return response;
    }

    if (kind === "guest_auth") {
      const ensured = await ensureAccessToken(request, rawAccess, refreshToken);
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
      message.includes("JWT_ACCESS_SECRET") ||
      message.includes("JWT_PUBLIC_KEY");
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
