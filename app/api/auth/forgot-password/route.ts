import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await apiFetch<{ ok: true; resetUrl?: string; token?: string }>(
      "/api/v1/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, password reset instructions have been sent.",
      ...(data.resetUrl ? { resetUrl: data.resetUrl } : {}),
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to request password reset" } },
      { status: 500 }
    );
  }
}
