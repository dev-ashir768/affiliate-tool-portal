import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { BotInboxResponse } from "@/types/shops";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await authenticatedApiFetch<BotInboxResponse>(
      `/api/v1/shops/${encodeURIComponent(id)}/bot-inbox`,
      { method: "GET" },
    );
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message } },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load bot inbox" } },
      { status: 500 },
    );
  }
}
