import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { getAccessToken } from "@/lib/auth/session";
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

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const data = await apiFetch<NavResponse>(
      `/api/v1/navigation/${area as NavArea}`,
      {
        method: "GET",
        accessToken,
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load navigation" } },
      { status: 500 }
    );
  }
}
