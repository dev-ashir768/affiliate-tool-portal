import { NextResponse } from "next/server";
import { apiFetchWithHeaders, setCookieValue } from "@/lib/auth/api";
import { TRUSTED_DEVICE_COOKIE } from "@/lib/auth/constants";
import {
  completeSession,
  mfaErrorResponse,
  requireMfaPendingToken,
  type SessionTokenPayload,
} from "@/lib/auth/mfa-bff";
import { setTrustedDeviceCookie } from "@/lib/auth/session";

type VerifyResponse = SessionTokenPayload & {
  status: string;
  user: { id: string; email: string; name: string };
  organizationId: string | null;
  platformMembership?: { id: string; role: string; status: string } | null;
  redirectTo: string;
  trustedDeviceRaw?: string;
};

export async function POST(request: Request) {
  try {
    const accessToken = await requireMfaPendingToken();
    const body = await request.json();
    const { data, headers } = await apiFetchWithHeaders<VerifyResponse>(
      "/api/v1/auth/2fa/verify",
      { method: "POST", accessToken, body: JSON.stringify(body) },
    );

    const failed = await completeSession(data, { verifyClaims: true });
    if (failed) return failed;

    // The API sets trusted_device via Set-Cookie (BFF fetch drops it), and may
    // also echo trustedDeviceRaw in JSON — accept either.
    const trustedDevice =
      data.trustedDeviceRaw?.trim() ||
      setCookieValue(headers, TRUSTED_DEVICE_COOKIE);
    if (trustedDevice) await setTrustedDeviceCookie(trustedDevice);

    return NextResponse.json({
      status: data.status,
      user: data.user,
      organizationId: data.organizationId,
      platformMembership: data.platformMembership ?? null,
      redirectTo: data.redirectTo,
    });
  } catch (err) {
    return mfaErrorResponse(err, "Failed to verify 2FA code");
  }
}
