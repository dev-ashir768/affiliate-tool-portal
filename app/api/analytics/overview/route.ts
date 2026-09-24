import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import {
  platformErrorResponse,
  toQuery,
} from "@/lib/api/platform-bff";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const qs = toQuery({
      from: sp.get("from"),
      to: sp.get("to"),
    });
    const data = await authenticatedApiFetch(`/api/v1/analytics/overview${qs}`, {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load analytics");
  }
}
