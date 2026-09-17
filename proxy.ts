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
  type RouteClass,
} from "@/lib/auth/route-policy";

async function rotateTokens(refreshToken: string) {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { accessToken: string; refreshToken: string };
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
  const dest = claims ? defaultRedirectForClaims(claims) : "/home";
  return NextResponse.redirect(new URL(dest, request.url));
}

/**
 * Area guards after a session token is available.
 * - staff → requires platformRole
 * - merchant → requires orgId; staff-only sessions bounce to backoffice
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
  const isMerchant = Boolean(claims.orgId);

  if (kind === "staff") {
    if (!isStaff) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return response;
  }

  if (kind === "merchant") {
    if (isStaff && !isMerchant) {
      return NextResponse.redirect(new URL("/backoffice/users", request.url));
    }
    if (!isMerchant) {
      const login = redirectToLogin(request, pathname);
      clearSessionCookies(login);
      return login;
    }
    return response;
  }

  return response;
}

async function ensureAccessToken(
  request: NextRequest,
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{
  accessToken: string | null;
  sessionResponse: NextResponse | null;
  cleared: boolean;
}> {
  if (accessToken) {
    return { accessToken, sessionResponse: null, cleared: false };
  }

  if (!refreshToken) {
    return { accessToken: null, sessionResponse: null, cleared: false };
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
  const { pathname } = request.nextUrl;
  const kind = classifyRoute(pathname);

  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (kind === "entry") {
    if (!accessToken && refreshToken) {
      const tokens = await rotateTokens(refreshToken);
      if (tokens) {
        const response = redirectAuthedAwayFromAuth(
          request,
          tokens.accessToken
        );
        applySessionCookies(response, tokens);
        return response;
      }
      const login = NextResponse.redirect(new URL("/login", request.url));
      clearSessionCookies(login);
      return login;
    }
    if (accessToken) {
      return redirectAuthedAwayFromAuth(request, accessToken);
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute(kind)) {
    const ensured = await ensureAccessToken(
      request,
      accessToken,
      refreshToken
    );
    accessToken = ensured.accessToken ?? undefined;

    if (ensured.cleared) {
      const login = redirectToLogin(request, pathname);
      clearSessionCookies(login);
      return login;
    }

    if (!accessToken) {
      return redirectToLogin(request, pathname);
    }

    const base = ensured.sessionResponse ?? NextResponse.next();
    return enforceAreaAccess(request, accessToken, kind, base);
  }

  if (kind === "guest_auth" && (accessToken || refreshToken)) {
    if (!accessToken && refreshToken) {
      const tokens = await rotateTokens(refreshToken);
      if (tokens) {
        const response = redirectAuthedAwayFromAuth(
          request,
          tokens.accessToken
        );
        applySessionCookies(response, tokens);
        return response;
      }
      const response = NextResponse.next();
      clearSessionCookies(response);
      return response;
    }
    if (accessToken) {
      return redirectAuthedAwayFromAuth(request, accessToken);
    }
  }

  // token_auth + anything else: pass through
  return NextResponse.next();
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
