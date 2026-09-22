import { NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET() {
  try {
    const data = await authenticatedApiFetch(
      "/api/v1/discovery/tiktok/status",
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load discovery TikTok status");
  }
}
