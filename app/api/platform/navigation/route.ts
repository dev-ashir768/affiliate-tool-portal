import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function GET(req: NextRequest) {
  try {
    const area = req.nextUrl.searchParams.get("area") ?? "backoffice";
    const data = await authenticatedApiFetch(
      `/api/v1/platform/navigation?area=${encodeURIComponent(area)}`,
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load navigation admin");
  }
}
