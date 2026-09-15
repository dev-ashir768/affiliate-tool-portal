import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  getApiBaseUrl,
  refreshCookieOptions,
} from "@/lib/auth/constants";

const AUTH_PAGES = new Set(["/login", "/signup", "/forgot-password"]);

const PROTECTED_PREFIXES = [
  "/home",
  "/settings",
  "/products",
  "/orders",
  "/analytics",
  "/backoffice",
];

function isAuthPage(pathname: string) {
  return AUTH_PAGES.has(pathname);
}

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (isProtected(pathname)) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      const tokens = await rotateTokens(refreshToken);
      if (tokens) {
        const response = NextResponse.next();
        applySessionCookies(response, tokens);
        return response;
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      clearSessionCookies(response);
      return response;
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage(pathname) && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/home",
    "/home/:path*",
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
