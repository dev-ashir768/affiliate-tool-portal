import { cookies, headers } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  IMPERSONATION_META_COOKIE,
  REFRESH_TOKEN_COOKIE,
  STAFF_BACKUP_ACCESS_COOKIE,
  STAFF_BACKUP_REFRESH_COOKIE,
  accessCookieOptions,
  clearAccessCookieOptions,
  clearRefreshCookieOptions,
  refreshCookieOptions,
} from "./constants";
import { secondsUntilExpiry, verifyAccessClaims } from "./access-token";
import { rotateSessionTokens, type RotateResult } from "./rotate";
import { clientIpFromHeaders } from "./client-ip";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ImpersonationMeta = {
  email: string;
  name: string;
};

export async function setSessionCookies(tokens: SessionTokens) {
  if (!tokens.accessToken?.trim() || !tokens.refreshToken?.trim()) {
    throw new Error("Both accessToken and refreshToken are required");
  }
  const jar = await cookies();
  jar.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    accessCookieOptions(secondsUntilExpiry(tokens.accessToken))
  );
  jar.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, refreshCookieOptions());
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, "", { ...clearAccessCookieOptions(), maxAge: 0 });
  jar.set(REFRESH_TOKEN_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
  jar.set(STAFF_BACKUP_ACCESS_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
  jar.set(STAFF_BACKUP_REFRESH_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
  jar.set(IMPERSONATION_META_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    httpOnly: false,
    maxAge: 0,
  });
}

/** Keep current staff session so Exit impersonation can restore it. */
export async function stashStaffSessionForImpersonation(
  meta: ImpersonationMeta
) {
  const jar = await cookies();
  const access = jar.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = jar.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!access || !refresh) {
    throw new Error("Staff session required before impersonation");
  }
  jar.set(STAFF_BACKUP_ACCESS_COOKIE, access, refreshCookieOptions());
  jar.set(STAFF_BACKUP_REFRESH_COOKIE, refresh, refreshCookieOptions());
  jar.set(IMPERSONATION_META_COOKIE, JSON.stringify(meta), {
    ...refreshCookieOptions(),
    httpOnly: false,
  });
}

export async function getImpersonationMeta(): Promise<ImpersonationMeta | null> {
  const jar = await cookies();
  const raw = jar.get(IMPERSONATION_META_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ImpersonationMeta;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function isImpersonating(): Promise<boolean> {
  const jar = await cookies();
  return Boolean(jar.get(STAFF_BACKUP_REFRESH_COOKIE)?.value);
}

/** Restore staff cookies after support session; returns false if no stash. */
export async function restoreStaffSessionFromImpersonation(): Promise<boolean> {
  const jar = await cookies();
  const access = jar.get(STAFF_BACKUP_ACCESS_COOKIE)?.value;
  const refresh = jar.get(STAFF_BACKUP_REFRESH_COOKIE)?.value;
  jar.set(STAFF_BACKUP_ACCESS_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
  jar.set(STAFF_BACKUP_REFRESH_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    maxAge: 0,
  });
  jar.set(IMPERSONATION_META_COOKIE, "", {
    ...clearRefreshCookieOptions(),
    httpOnly: false,
    maxAge: 0,
  });
  if (!access || !refresh) return false;
  await setSessionCookies({ accessToken: access, refreshToken: refresh });
  return true;
}

export async function getAccessToken() {
  const jar = await cookies();
  return jar.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const jar = await cookies();
  return jar.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * Route Handler helper: rotate the session from the refresh cookie and persist
 * the new pair. Clears cookies only when the API rejects the refresh token.
 */
export async function refreshSessionFromCookies(): Promise<RotateResult> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return { ok: false, reason: "unauthorized" };
  let clientIp: string | undefined;
  try {
    clientIp = clientIpFromHeaders(await headers());
  } catch {
    clientIp = undefined;
  }
  const result = await rotateSessionTokens(refreshToken, {
    accessToken: await getAccessToken(),
    clientIp,
  });
  if (result.ok) {
    await setSessionCookies(result);
  } else if (result.reason === "unauthorized") {
    await clearSessionCookies();
  }
  return result;
}

/** Server layout helper — verified session claims or null. */
export async function getVerifiedSessionClaims() {
  const token = await getAccessToken();
  if (!token) return null;
  return verifyAccessClaims(token);
}
