import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get("shopId") ?? "";
    const sync = req.nextUrl.searchParams.get("sync");
    const qs = new URLSearchParams({ shopId });
    if (sync) qs.set("sync", sync);
    const data = await authenticatedApiFetch(
      `/api/v1/messages/conversations?${qs.toString()}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load conversations");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await authenticatedApiFetch("/api/v1/messages/conversations", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to open conversation");
  }
}
