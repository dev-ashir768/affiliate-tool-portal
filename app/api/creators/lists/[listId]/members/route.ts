import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

type Ctx = { params: Promise<{ listId: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { listId } = await ctx.params;
    const body = await req.json();
    const data = await authenticatedApiFetch(
      `/api/v1/creators/lists/${encodeURIComponent(listId)}/members`,
      { method: "POST", body: JSON.stringify(body) },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to add list member");
  }
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { listId } = await ctx.params;
    const data = await authenticatedApiFetch(
      `/api/v1/creators/lists/${encodeURIComponent(listId)}/members`,
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load list members");
  }
}
