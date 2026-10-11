import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { verifyAccessClaims } from "@/lib/auth/access-token";
import {
  clearMfaPendingCookies,
  clearSessionCookies,
  getMfaPendingToken,
  setMfaPendingCookies,
  setSessionCookies,
} from "@/lib/auth/session";
import type { MfaPurpose } from "@/lib/auth/constants";

export type MfaChallengeStatus = "mfa_setup" | "mfa_required";

export type SessionTokenPayload = {
  accessToken?: string;
  refreshToken?: string;
};

export function isMfaChallengeStatus(
  status: unknown,
): status is MfaChallengeStatus {
  return status === "mfa_setup" || status === "mfa_required";
}

export function purposeForStatus(status: MfaChallengeStatus): MfaPurpose {
  return status === "mfa_setup" ? "setup" : "verify";
}

function internalError(message: string, status = 502) {
  return NextResponse.json(
    { error: { code: "INTERNAL", message } },
    { status },
  );
}

/**
 * Login/register returned an MFA challenge: drop any session cookies, store the
 * pending token + purpose. Returns an error response, or null on success.
 */
export async function beginMfaChallenge(data: {
  status: MfaChallengeStatus;
  mfaPendingToken?: string;
}): Promise<NextResponse | null> {
  if (!data.mfaPendingToken?.trim()) {
    return internalError(
      "MFA token missing from API. Check PORTAL_BFF_SECRET matches on portal and APIs.",
    );
  }
  await clearSessionCookies();
  await setMfaPendingCookies(data.mfaPendingToken, purposeForStatus(data.status));
  return null;
}

/**
 * Persist a full session (access + refresh) and clear any pending MFA cookies.
 * Returns an error response, or null on success.
 */
export async function completeSession(
  data: SessionTokenPayload,
  opts: { verifyClaims?: boolean } = {},
): Promise<NextResponse | null> {
  if (!data.accessToken?.trim() || !data.refreshToken?.trim()) {
    return internalError(
      "Auth tokens missing from API. Check PORTAL_BFF_SECRET matches on portal and APIs.",
    );
  }
  if (opts.verifyClaims) {
    // Fail closed if portal cannot verify the API-issued JWT — otherwise the
    // UI shows "Logged in" then proxy immediately sends the user back to login.
    const claims = await verifyAccessClaims(data.accessToken);
    if (!claims) {
      return internalError(
        "Login token could not be verified. JWT_PUBLIC_KEY / JWT_ACCESS_SECRET must match the APIs.",
      );
    }
  }
  await setSessionCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  await clearMfaPendingCookies();
  return null;
}

/** mfa_pending cookie value, or an ApiClientError(401) when absent. */
export async function requireMfaPendingToken(): Promise<string> {
  const token = await getMfaPendingToken();
  if (!token) {
    throw new ApiClientError(
      401,
      "UNAUTHORIZED",
      "Invalid or expired MFA challenge",
    );
  }
  return token;
}

/** API message for a dead pending token (distinct from a wrong TOTP code, also 401). */
const MFA_CHALLENGE_REJECTED = /MFA challenge/i;

/** BFF error body; an expired/invalid MFA challenge also drops the pending cookies. */
export async function mfaErrorResponse(err: unknown, fallback: string) {
  if (err instanceof ApiClientError) {
    if (err.status === 401 && MFA_CHALLENGE_REJECTED.test(err.message)) {
      await clearMfaPendingCookies();
    }
    return NextResponse.json(
      { error: { code: err.code, message: err.message, details: err.details } },
      { status: err.status },
    );
  }
  return internalError(fallback, 500);
}
