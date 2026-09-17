import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { ShopsListResponse } from "@/types/shops";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<ShopsListResponse>(
      "/api/v1/shops",
      { method: "GET" }
    );
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
      { error: { code: "INTERNAL", message: "Failed to load shops" } },
      { status: 500 }
    );
  }
}
