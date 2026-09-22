import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function GET() {
  try {
    const data = await authenticatedApiFetch(
      "/api/v1/platform/discovery/crawl/scheduler",
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load crawl scheduler");
  }
}

export async function POST() {
  try {
    const data = await authenticatedApiFetch(
      "/api/v1/platform/discovery/crawl/scheduler/register",
      { method: "POST", body: "{}" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to register crawl scheduler");
  }
}
