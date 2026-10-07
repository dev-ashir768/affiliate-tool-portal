import { proxyActivation } from "@/lib/api/bot-activation-proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyActivation(id, "", { method: "POST" }, "Failed to start bot sign-in");
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyActivation(id, "", { method: "DELETE" }, "Failed to close bot sign-in");
}
