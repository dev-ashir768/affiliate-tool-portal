import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const data = await authenticatedApiFetch(
      `/api/v1/creators/campaigns/${encodeURIComponent(id)}/multi-shop-run`,
      { method: "POST", body: JSON.stringify(body) },
    );
    return NextResponse.json(data, { status: 202 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to start multi-shop run");
  }
}
