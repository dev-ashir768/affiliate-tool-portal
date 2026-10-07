import { NextRequest } from "next/server";
import { proxyActivation } from "@/lib/api/bot-activation-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const after = Number(request.nextUrl.searchParams.get("after") ?? "0");
  const qs = `?after=${Number.isFinite(after) ? after : 0}`;
  return proxyActivation(id, `/frame${qs}`, { method: "GET" }, "Failed to load screen");
}
