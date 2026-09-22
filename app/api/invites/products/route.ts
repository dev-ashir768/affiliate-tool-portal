import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get("shopId") ?? "";
    const pageToken = req.nextUrl.searchParams.get("pageToken");
    const pageSize = req.nextUrl.searchParams.get("pageSize");
    const qs = new URLSearchParams({ shopId });
    if (pageToken) qs.set("pageToken", pageToken);
    if (pageSize) qs.set("pageSize", pageSize);
    const data = await authenticatedApiFetch(
      `/api/v1/invites/products?${qs.toString()}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load products");
  }
}
