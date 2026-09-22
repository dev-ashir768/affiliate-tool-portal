import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function POST() {
  try {
    const data = await authenticatedApiFetch(
      "/api/v1/platform/discovery/search/reindex",
      { method: "POST", body: "{}" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to reindex discovery search");
  }
}
