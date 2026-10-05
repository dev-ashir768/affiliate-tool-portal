import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  clearAccessCookieOptions,
  clearRefreshCookieOptions,
  refreshCookieOptions,
} from "./constants";
import { verifyAccessClaims } from "./access-token";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function setSessionCookies(tokens: SessionTokens) {
  if (!tokens.accessToken?.trim() || !tokens.refreshToken?.trim()) {
    throw new Error("Both accessToken and refreshToken are required");
  }
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, accessCookieOptions());
  jar.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions());
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, "", { ...clearAccessCookieOptions(), maxAge: 0 });
  jar.set(REFRESH_TOKEN_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
}

export async function getAccessToken() {
  const jar = await cookies();
  return jar.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const jar = await cookies();
  return jar.get(REFRESH_TOKEN_COOKIE)?.value;
}

/** Server layout helper — verified session claims or null. */
export async function getVerifiedSessionClaims() {
  const token = await getAccessToken();
  if (!token) return null;
  return verifyAccessClaims(token);
}
