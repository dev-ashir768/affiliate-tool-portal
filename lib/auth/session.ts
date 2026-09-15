import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
} from "./constants";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function setSessionCookies(tokens: SessionTokens) {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, accessCookieOptions());
  jar.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions());
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(ACCESS_TOKEN_COOKIE);
  jar.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken() {
  const jar = await cookies();
  return jar.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const jar = await cookies();
  return jar.get(REFRESH_TOKEN_COOKIE)?.value;
}
