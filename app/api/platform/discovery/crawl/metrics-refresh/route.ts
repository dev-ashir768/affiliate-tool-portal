import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await authenticatedApiFetch(
      "/api/v1/platform/discovery/crawl/metrics-refresh",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    const sync = Boolean((body as { sync?: boolean }).sync);
    return NextResponse.json(data, { status: sync ? 200 : 202 });
  } catch (err) {
    return platformErrorResponse(
      err,
      "Failed to start discovery metrics refresh",
    );
  }
}
