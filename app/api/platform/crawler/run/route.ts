import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformCrawlerRunResult } from "@/types/platform";

export async function POST() {
  try {
    const data = await authenticatedApiFetch<PlatformCrawlerRunResult>(
      "/api/v1/platform/crawler/run",
      { method: "POST" },
    );
    return NextResponse.json(data, { status: 202 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to enqueue crawler dry-run");
  }
}
