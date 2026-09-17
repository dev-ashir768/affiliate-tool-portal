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
      page: sp.get("page"),
      pageSize: sp.get("pageSize"),
      search: sp.get("search"),
      sortBy: sp.get("sortBy"),
      sortOrder: sp.get("sortOrder"),
    });
    const data = await authenticatedApiFetch(`/api/v1/platform/audit${qs}`, {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load audit logs");
  }
}
