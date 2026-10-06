import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { NavArea, NavResponse } from "@/types/navigation";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ area: string }> }
) {
  const { area } = await ctx.params;
  if (area !== "dashboard" && area !== "backoffice") {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid area" } },
      { status: 400 }
    );
  }

  try {
    const data = await authenticatedApiFetch<NavResponse>(
      `/api/v1/navigation/${area as NavArea}`,
      { method: "GET" }
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load navigation");
  }
}
