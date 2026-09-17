/**
 * Decode access JWT payload for routing (platformRole / orgId).
 *
 * Trust boundary: httpOnly cookies are set only by our BFF after API auth.
 * The API still verifies signatures on every call. Decode-only here is for
 * UX redirects / area guards — cookie theft risk is unchanged.
 */
export function readAccessClaims(token: string): {
  orgId: string | null;
  platformRole: string | null;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const b64 = padded + "=".repeat(padLen);
    const json =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8");
    const data = JSON.parse(json) as {
      orgId?: unknown;
      platformRole?: unknown;
    };
    return {
      orgId: data.orgId == null || data.orgId === "" ? null : String(data.orgId),
      platformRole:
        data.platformRole == null || data.platformRole === ""
          ? null
          : String(data.platformRole),
    };
  } catch {
    return null;
  }
}

/** Default post-login destination from claims. */
export function defaultRedirectForClaims(claims: {
  orgId: string | null;
  platformRole: string | null;
}): string {
  return claims.platformRole ? "/backoffice/users" : "/home";
}

/** Relative path only — blocks open redirects (`//`, `/\`, `\`, etc.). */
const SAFE_RELATIVE_PATH = /^\/[a-zA-Z0-9/_-]*$/;

function isSafeRelativePath(path: string): boolean {
  return SAFE_RELATIVE_PATH.test(path) && !path.includes("\\");
}

/**
 * Staff may only follow `next` under /backoffice; merchants only non-backoffice.
 */
export function resolvePostAuthRedirect(opts: {
  next: string | null;
  redirectTo?: string | null;
  platformRole: string | null;
}): string {
  const fallback =
    opts.redirectTo && isSafeRelativePath(opts.redirectTo)
      ? opts.redirectTo
      : opts.platformRole
        ? "/backoffice/users"
        : "/home";

  const next = opts.next;
  if (!next || !isSafeRelativePath(next)) {
    return fallback;
  }

  const isBackoffice =
    next === "/backoffice" || next.startsWith("/backoffice/");

  if (opts.platformRole) {
    return isBackoffice ? next : fallback;
  }
  return isBackoffice ? fallback : next;
}
