import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await apiFetch<{ ok: true }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
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
      { error: { code: "INTERNAL", message: "Failed to reset password" } },
      { status: 500 }
    );
  }
}
