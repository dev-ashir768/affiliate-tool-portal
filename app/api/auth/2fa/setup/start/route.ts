import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/auth/api";
import { mfaErrorResponse, requireMfaPendingToken } from "@/lib/auth/mfa-bff";

export async function POST() {
  try {
    const accessToken = await requireMfaPendingToken();
    const data = await apiFetch<{ otpauthUrl: string }>(
      "/api/v1/auth/2fa/setup/start",
      { method: "POST", accessToken },
    );
    return NextResponse.json(data);
  } catch (err) {
    return mfaErrorResponse(err, "Failed to start 2FA setup");
  }
}
