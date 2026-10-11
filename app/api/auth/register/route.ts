import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import {
  beginMfaChallenge,
  completeSession,
  isMfaChallengeStatus,
  type MfaChallengeStatus,
} from "@/lib/auth/mfa-bff";

type Organization = { id: string; name: string; slug: string };

type RegisterResponse =
  | {
      status: MfaChallengeStatus;
      user: { id: string; email: string; name: string };
      organization?: Organization;
      mfaPendingToken?: string;
    }
  | {
      status?: "authenticated";
      user: { id: string; email: string; name: string };
      organization: Organization;
      platformMembership?: null;
      redirectTo: string;
      accessToken: string;
      refreshToken: string;
    };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await apiFetch<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (isMfaChallengeStatus(data.status)) {
      const challenge = data as Extract<RegisterResponse, { mfaPendingToken?: string }>;
      const failed = await beginMfaChallenge({
        status: data.status,
        mfaPendingToken: challenge.mfaPendingToken,
      });
      if (failed) return failed;
      return NextResponse.json({
        status: data.status,
        user: data.user,
        organization: challenge.organization,
      });
    }

    const session = data as Extract<RegisterResponse, { accessToken: string }>;
    const failed = await completeSession(session);
    if (failed) return failed;

    return NextResponse.json({
      status: "authenticated",
      user: session.user,
      organization: session.organization,
      platformMembership: session.platformMembership ?? null,
      redirectTo: session.redirectTo ?? "/onboarding",
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Registration failed" } },
      { status: 500 }
    );
  }
}
