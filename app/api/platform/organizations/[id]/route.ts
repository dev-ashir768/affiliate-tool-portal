import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformOrgDetail } from "@/types/platform";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await authenticatedApiFetch<PlatformOrgDetail>(
      `/api/v1/platform/organizations/${encodeURIComponent(id)}`,
      { method: "GET" }
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load organization");
  }
}
