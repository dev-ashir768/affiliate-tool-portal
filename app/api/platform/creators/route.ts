import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformCreatorListResponse } from "@/types/platform";

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams.toString();
    const path = qs
      ? `/api/v1/platform/creators?${qs}`
      : "/api/v1/platform/creators";
    const data = await authenticatedApiFetch<PlatformCreatorListResponse>(
      path,
      { method: "GET" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load creators");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await authenticatedApiFetch("/api/v1/platform/creators", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to create creator");
  }
}
