import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<Record<string, unknown>>(
      "/api/v1/shops/tiktok/oauth/status",
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load OAuth status" } },
      { status: 500 },
    );
  }
}
