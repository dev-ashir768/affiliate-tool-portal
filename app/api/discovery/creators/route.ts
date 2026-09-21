import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams.toString();
    const path = qs
      ? `/api/v1/discovery/creators?${qs}`
      : "/api/v1/discovery/creators";
    const data = await authenticatedApiFetch(path, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to search discovery");
  }
}
