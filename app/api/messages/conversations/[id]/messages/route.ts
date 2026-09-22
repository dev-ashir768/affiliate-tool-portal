import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sync = req.nextUrl.searchParams.get("sync");
    const qs = sync ? `?sync=${encodeURIComponent(sync)}` : "";
    const data = await authenticatedApiFetch(
      `/api/v1/messages/conversations/${encodeURIComponent(id)}/messages${qs}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load messages");
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const data = await authenticatedApiFetch(
      `/api/v1/messages/conversations/${encodeURIComponent(id)}/messages`,
      { method: "POST", body: JSON.stringify(body) },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to send message");
  }
}
