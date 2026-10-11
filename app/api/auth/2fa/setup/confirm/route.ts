import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/auth/api";
import {
  completeSession,
  mfaErrorResponse,
  requireMfaPendingToken,
  type SessionTokenPayload,
} from "@/lib/auth/mfa-bff";

type ConfirmResponse = SessionTokenPayload & {
  status: string;
  backupCodes: string[];
  user: { id: string; email: string; name: string };
  organizationId: string | null;
  platformMembership?: { id: string; role: string; status: string } | null;
  redirectTo: string;
};

export async function POST(request: Request) {
  try {
    const accessToken = await requireMfaPendingToken();
    const body = await request.json();
    const data = await apiFetch<ConfirmResponse>(
      "/api/v1/auth/2fa/setup/confirm",
      { method: "POST", accessToken, body: JSON.stringify(body) },
    );

    const failed = await completeSession(data, { verifyClaims: true });
    if (failed) return failed;

    return NextResponse.json({
      status: data.status,
      backupCodes: data.backupCodes,
      user: data.user,
      organizationId: data.organizationId,
      platformMembership: data.platformMembership ?? null,
      redirectTo: data.redirectTo,
    });
  } catch (err) {
    return mfaErrorResponse(err, "Failed to confirm 2FA setup");
  }
}
