import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformPlansResponse } from "@/types/billing";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<PlatformPlansResponse>(
      "/api/v1/platform/plans",
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load plans");
  }
}
