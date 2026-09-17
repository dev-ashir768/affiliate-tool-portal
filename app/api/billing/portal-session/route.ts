import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { PortalSessionResponse } from "@/types/billing";

export async function POST() {
  try {
    const data = await authenticatedApiFetch<PortalSessionResponse>(
      "/api/v1/billing/portal-session",
      { method: "POST" }
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
      { error: { code: "INTERNAL", message: "Failed to create portal session" } },
      { status: 500 }
    );
  }
}
