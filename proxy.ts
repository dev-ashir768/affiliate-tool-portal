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

const AUTH_PAGES = new Set(["/login", "/signup", "/forgot-password"]);

/** Auth flows that must stay reachable even when a session cookie exists. */
const AUTH_TOKEN_PAGES = new Set(["/reset-password"]);

function isInvitePath(pathname: string) {
  return pathname === "/invite" || pathname.startsWith("/invite/");
}

function isAuthTokenPage(pathname: string) {
  return AUTH_TOKEN_PAGES.has(pathname) || isInvitePath(pathname);
}

const DASHBOARD_PREFIXES = [
  "/home",
  "/shops",
  "/team",
  "/billing",
  "/settings",
  "/products",
  "/orders",
  "/analytics",
];

function isAuthPage(pathname: string) {
  return AUTH_PAGES.has(pathname);
}

function isBackoffice(pathname: string) {
  return pathname === "/backoffice" || pathname.startsWith("/backoffice/");
}

function isDashboard(pathname: string) {
  return DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isProtected(pathname: string) {
  return isBackoffice(pathname) || isDashboard(pathname);
}

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

/**
 * Area guards after a session token is available.
 * - /backoffice/* requires platformRole
 * - dashboard paths require orgId (merchant session)
 * - staff-only (platformRole && !orgId) on dashboard → /backoffice/users
 */
function enforceAreaAccess(
  request: NextRequest,
  accessToken: string,
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

  if (isBackoffice(pathname)) {
    if (!isStaff) {
      // Merchant (or session without platform role) → home
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return response;
  }

  if (isDashboard(pathname)) {
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

function redirectAuthedAwayFromAuth(
  request: NextRequest,
  accessToken: string
): NextResponse {
  const claims = readAccessClaims(accessToken);
  const dest = claims
    ? defaultRedirectForClaims(claims)
    : "/home";
  return NextResponse.redirect(new URL(dest, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // App entry: never show the Next.js starter — send users to login or their area.
  if (pathname === "/") {
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

  if (isProtected(pathname)) {
    let sessionResponse: NextResponse | null = null;

    if (!accessToken && refreshToken) {
      const tokens = await rotateTokens(refreshToken);
      if (tokens) {
        accessToken = tokens.accessToken;
        sessionResponse = NextResponse.next();
        applySessionCookies(sessionResponse, tokens);
      } else {
        const login = redirectToLogin(request, pathname);
        clearSessionCookies(login);
        return login;
      }
    }

    if (!accessToken) {
      return redirectToLogin(request, pathname);
    }

    const base = sessionResponse ?? NextResponse.next();
    return enforceAreaAccess(request, accessToken, base);
  }

  if (isAuthPage(pathname) && (accessToken || refreshToken)) {
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

  // Logged-in users may still open reset/invite links without being bounced home.
  if (isAuthTokenPage(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/invite",
    "/invite/:path*",
    "/home",
    "/home/:path*",
    "/shops",
    "/shops/:path*",
    "/team",
    "/team/:path*",
    "/billing",
    "/billing/:path*",
    "/settings",
    "/settings/:path*",
    "/products",
    "/products/:path*",
    "/orders",
    "/orders/:path*",
    "/analytics",
    "/analytics/:path*",
    "/backoffice",
    "/backoffice/:path*",
  ],
};
