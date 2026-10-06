import { decodeJwt, errors, importSPKI, jwtVerify } from "jose";

export type AccessClaims = {
  orgId: string | null;
  platformRole: string | null;
  hasProductAccess: boolean;
};

/** Why an access token cannot be used for routing. */
export type AccessTokenStatus =
  | { status: "valid"; claims: AccessClaims }
  | { status: "expired" }
  | { status: "misconfigured" }
  | { status: "invalid" };

type VerifyKey = {
  key: CryptoKey | Uint8Array;
  algorithms: ["EdDSA"] | ["HS256"];
};

let publicKey: Promise<CryptoKey> | null = null;

/**
 * Preferred: JWT_PUBLIC_KEY (Ed25519 PEM, same as APIs) — the portal can only
 * verify, never mint. Fallback: shared HS256 JWT_ACCESS_SECRET.
 */
async function accessVerifyKey(): Promise<VerifyKey | null> {
  const pem = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, "\n").trim();
  if (pem) {
    publicKey ??= importSPKI(pem, "EdDSA");
    try {
      return { key: await publicKey, algorithms: ["EdDSA"] };
    } catch {
      publicKey = null;
      return null;
    }
  }
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 32) return null;
  return { key: new TextEncoder().encode(secret), algorithms: ["HS256"] };
}

/** Seconds until the token's `exp` (for cookie maxAge); fallback when unreadable. */
export function secondsUntilExpiry(token: string, fallback = 900): number {
  try {
    const { exp } = decodeJwt(token);
    if (typeof exp !== "number") return fallback;
    return Math.max(0, exp - Math.floor(Date.now() / 1000));
  } catch {
    return fallback;
  }
}

function claimsFromPayload(payload: Record<string, unknown>): AccessClaims {
  return {
    orgId:
      payload.orgId == null || payload.orgId === ""
        ? null
        : String(payload.orgId),
    platformRole:
      payload.platformRole == null || payload.platformRole === ""
        ? null
        : String(payload.platformRole),
    hasProductAccess: Boolean(payload.hasProductAccess),
  };
}

/**
 * Distinguish expiry (safe to refresh) from secret mismatch (must not rotate —
 * rotating would revoke the refresh cookie while discarding the new tokens).
 */
export async function inspectAccessToken(
  token: string
): Promise<AccessTokenStatus> {
  const verify = await accessVerifyKey();
  if (!verify) {
    return { status: "misconfigured" };
  }
  try {
    const { payload } = await jwtVerify(token, verify.key, {
      algorithms: verify.algorithms,
    });
    return {
      status: "valid",
      claims: claimsFromPayload(payload as Record<string, unknown>),
    };
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return { status: "expired" };
    }
    // Decodable JWT + failed verify ⇒ almost always wrong JWT_ACCESS_SECRET.
    try {
      decodeJwt(token);
      return { status: "misconfigured" };
    } catch {
      return { status: "invalid" };
    }
  }
}

/**
 * Verify access JWT signature + expiry for routing (platformRole / orgId).
 * Requires JWT_ACCESS_SECRET (same as APIs). Returns null if invalid/missing.
 */
export async function verifyAccessClaims(
  token: string
): Promise<AccessClaims | null> {
  const inspected = await inspectAccessToken(token);
  return inspected.status === "valid" ? inspected.claims : null;
}

/** Default post-login destination from claims. */
export function defaultRedirectForClaims(claims: {
  orgId: string | null;
  platformRole: string | null;
  hasProductAccess?: boolean;
}): string {
  if (claims.platformRole) return "/backoffice/users";
  return claims.hasProductAccess ? "/home" : "/onboarding";
}

/** Relative path only — blocks open redirects (`//`, `/\`, `\`, etc.). */
const SAFE_RELATIVE_PATH = /^\/[a-zA-Z0-9/_-]*$/;

function isSafeRelativePath(path: string): boolean {
  return SAFE_RELATIVE_PATH.test(path) && !path.includes("\\");
}

function isBackofficePath(path: string): boolean {
  return path === "/backoffice" || path.startsWith("/backoffice/");
}

/**
 * Post-auth `next` resolution — strict area isolation by role.
 * - Staff (platformRole): backoffice paths only
 * - Merchant: non-backoffice only
 */
export function resolvePostAuthRedirect(opts: {
  next: string | null;
  redirectTo?: string | null;
  platformRole: string | null;
}): string {
  const isStaff = Boolean(opts.platformRole);

  const fallback =
    opts.redirectTo && isSafeRelativePath(opts.redirectTo)
      ? opts.redirectTo
      : isStaff
        ? "/backoffice/users"
        : "/home";

  const next = opts.next;
  if (!next || !isSafeRelativePath(next)) {
    return fallback;
  }

  const nextIsBackoffice = isBackofficePath(next);

  if (isStaff) {
    return nextIsBackoffice ? next : fallback;
  }
  return nextIsBackoffice ? fallback : next;
}
