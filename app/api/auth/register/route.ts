import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { setSessionCookies } from "@/lib/auth/session";

type RegisterResponse = {
  user: { id: string; email: string; name: string };
  organization: { id: string; name: string; slug: string };
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

    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({
      user: data.user,
      organization: data.organization,
      platformMembership: data.platformMembership ?? null,
      redirectTo: data.redirectTo ?? "/home",
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
