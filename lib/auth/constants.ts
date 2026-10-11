export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
/** Stashed staff session while viewing as a merchant (impersonation). */
export const STAFF_BACKUP_ACCESS_COOKIE = "staff_backup_access";
export const STAFF_BACKUP_REFRESH_COOKIE = "staff_backup_refresh";
export const IMPERSONATION_META_COOKIE = "impersonation_meta";
/** Short-lived JWT proving password OK but 2FA not yet complete. */
export const MFA_PENDING_COOKIE = "mfa_pending";
/** Companion to mfa_pending: which challenge page to send the user to. */
export const MFA_PURPOSE_COOKIE = "mfa_purpose";
export const TRUSTED_DEVICE_COOKIE = "trusted_device";

export type MfaPurpose = "setup" | "verify";

export const MFA_PENDING_DEFAULT_MAX_AGE_SEC = 600;
export const TRUSTED_DEVICE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export function isMfaPurpose(value: unknown): value is MfaPurpose {
  return value === "setup" || value === "verify";
}

export function getApiBaseUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000"
  );
}

function cookieSecure(): boolean {
  const override = process.env.COOKIE_SECURE;
  if (override === "true" || override === "1") return true;
  if (override === "false" || override === "0") return false;
  return process.env.NODE_ENV === "production";
}

export function accessCookieOptions(maxAgeSec = 900) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function refreshCookieOptions(maxAgeSec = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: maxAgeSec,
  };
}

/** Options for cookies.delete so clear matches set flags. */
export function clearAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
  };
}

export function clearRefreshCookieOptions() {
  return clearAccessCookieOptions();
}

export function mfaPendingCookieOptions(
  maxAgeSec = MFA_PENDING_DEFAULT_MAX_AGE_SEC,
) {
  return accessCookieOptions(maxAgeSec);
}

export function trustedDeviceCookieOptions(
  maxAgeSec = TRUSTED_DEVICE_MAX_AGE_SEC,
) {
  return refreshCookieOptions(maxAgeSec);
}

export function getPortalBffSecret(): string | undefined {
  const v = process.env.PORTAL_BFF_SECRET?.trim();
  return v || undefined;
}

/**
 * BFF → API shared secret. Required in production; recommended in all envs.
 * Throws when missing so misconfig fails closed instead of silently dropping refresh tokens.
 */
export function requirePortalBffSecret(): string {
  const secret = getPortalBffSecret();
  if (!secret) {
    throw new Error(
      "PORTAL_BFF_SECRET is required. Set the same value on portal and APIs.",
    );
  }
  return secret;
}
