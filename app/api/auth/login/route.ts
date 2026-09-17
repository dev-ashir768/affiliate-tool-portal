import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { setSessionCookies } from "@/lib/auth/session";

type LoginResponse = {
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
    const data = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({
      user: data.user,
      organizationId: data.organizationId,
      platformMembership: data.platformMembership ?? null,
      redirectTo: data.redirectTo,
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
