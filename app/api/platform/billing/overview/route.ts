import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { BillingOverview } from "@/types/platform";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<BillingOverview>(
      "/api/v1/platform/billing/overview",
      { method: "GET" }
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load billing overview");
  }
}
