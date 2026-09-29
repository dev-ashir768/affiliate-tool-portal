import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  getApiBaseUrl,
  refreshCookieOptions,
} from "@/lib/auth/constants";
import {
  defaultRedirectForClaims,
  readAccessClaims,
} from "@/lib/auth/access-token";
import {
  classifyRoute,
  isProtectedRoute,
  isSubscriptionExemptPath,
  type RouteClass,
} from "@/lib/auth/route-policy";

async function rotateTokens(refreshToken: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as { accessToken: string; refreshToken: string };
  } catch {
    return null;
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
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
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

function redirectAuthedAwayFromAuth(
  request: NextRequest,
  accessToken: string
): NextResponse {
  const claims = readAccessClaims(accessToken);
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
 * Area guards after a session token is available.
 * Strict isolation by role — nobody crosses into the other area's work:
 * - staff (platformRole) → /backoffice/* only
 * - merchant (orgId, no platformRole) → product routes only
 */
function enforceAreaAccess(
  request: NextRequest,
  accessToken: string,
  kind: RouteClass,
  response: NextResponse
): NextResponse {
  const claims = readAccessClaims(accessToken);
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
 * Prefer a valid (non-expired) access token; otherwise rotate via refresh.
 */
async function ensureAccessToken(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{
  accessToken: string | null;
  sessionResponse: NextResponse | null;
  cleared: boolean;
}> {
  if (accessToken && readAccessClaims(accessToken)) {
    return { accessToken, sessionResponse: null, cleared: false };
  }

  if (!refreshToken) {
    return {
      accessToken: null,
      sessionResponse: null,
      cleared: Boolean(accessToken),
    };
  }

  const tokens = await rotateTokens(refreshToken);
  if (!tokens) {
    return { accessToken: null, sessionResponse: null, cleared: true };
  }

  const sessionResponse = NextResponse.next();
  applySessionCookies(sessionResponse, tokens);
  return {
    accessToken: tokens.accessToken,
    sessionResponse,
    cleared: false,
  };
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const kind = classifyRoute(pathname);

    const rawAccess = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (kind === "entry") {
      const ensured = await ensureAccessToken(rawAccess, refreshToken);
      if (ensured.accessToken) {
        const response = redirectAuthedAwayFromAuth(
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

      if (ensured.cleared || !ensured.accessToken) {
        const login = redirectToLogin(request, pathname);
        clearSessionCookies(login);
        return login;
      }

      const base = ensured.sessionResponse ?? NextResponse.next();
      return enforceAreaAccess(request, ensured.accessToken, kind, base);
    }

    if (kind === "guest_auth") {
      const ensured = await ensureAccessToken(rawAccess, refreshToken);
      if (ensured.accessToken) {
        const response = redirectAuthedAwayFromAuth(
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
  } catch {
    // Never blank the app from a proxy failure — page/BFF still enforce auth.
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
