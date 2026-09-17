import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<{
      items: unknown[];
      meta: { total: number; note: string };
    }>("/api/v1/platform/proxies", { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load proxies");
  }
}
