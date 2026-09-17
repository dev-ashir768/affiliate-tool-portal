import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import type { BillingPlansResponse } from "@/types/billing";

export async function GET() {
  try {
    const data = await apiFetch<BillingPlansResponse>("/api/v1/billing/plans", {
      method: "GET",
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
      { error: { code: "INTERNAL", message: "Failed to load plans" } },
      { status: 500 }
    );
  }
}
