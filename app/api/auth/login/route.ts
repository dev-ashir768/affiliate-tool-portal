import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import {
  beginMfaChallenge,
  completeSession,
  isMfaChallengeStatus,
  type MfaChallengeStatus,
} from "@/lib/auth/mfa-bff";
import { getTrustedDeviceToken } from "@/lib/auth/session";

type LoginResponse =
  | {
      status: MfaChallengeStatus;
      user: { id: string; email: string; name: string };
      mfaPendingToken?: string;
    }
  | {
      status?: "authenticated";
      user: { id: string; email: string; name: string };
      organizationId: string | null;
      platformMembership?: {
        id: string;
        role: string;
        status: string;
      } | null;
      redirectTo: string;
      accessToken: string;
      refreshToken: string;
    };

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // The API reads the trusted-device cookie from the Cookie header (the BFF
    // fetch is server-side, so the browser cookie is not forwarded for us).
    const trustedDevice = await getTrustedDeviceToken();
    const headers = trustedDevice
      ? { Cookie: `trusted_device=${encodeURIComponent(trustedDevice)}` }
      : undefined;

    const data = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    if (isMfaChallengeStatus(data.status)) {
      const challenge = data as Extract<LoginResponse, { mfaPendingToken?: string }>;
      const failed = await beginMfaChallenge({
        status: data.status,
        mfaPendingToken: challenge.mfaPendingToken,
      });
      if (failed) return failed;
      return NextResponse.json({ status: data.status, user: data.user });
    }

    const session = data as Extract<LoginResponse, { accessToken: string }>;
    const failed = await completeSession(session, { verifyClaims: true });
    if (failed) return failed;

    return NextResponse.json({
      status: "authenticated",
      user: session.user,
      organizationId: session.organizationId,
      platformMembership: session.platformMembership ?? null,
      redirectTo: session.redirectTo,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Login failed" } },
      { status: 500 }
    );
  }
}
