import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { getAccessToken } from "@/lib/auth/session";
import type { MeResponse } from "@/types/auth";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const data = await apiFetch<MeResponse>("/api/v1/auth/me", {
      method: "GET",
      accessToken,
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
      { error: { code: "INTERNAL", message: "Failed to load session" } },
      { status: 500 }
    );
  }
}
