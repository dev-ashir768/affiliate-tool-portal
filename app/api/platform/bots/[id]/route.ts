import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const data = await authenticatedApiFetch(
      `/api/v1/platform/bots/${encodeURIComponent(id)}`,
      { method: "PATCH", body: JSON.stringify(body) },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to update bot");
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await authenticatedApiFetch(
      `/api/v1/platform/bots/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to delete bot");
  }
}
