import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformCrawlerStatus } from "@/types/platform";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<PlatformCrawlerStatus>(
      "/api/v1/platform/crawler",
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load crawler status");
  }
}
