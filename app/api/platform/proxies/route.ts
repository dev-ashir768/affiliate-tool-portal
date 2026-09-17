import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformProxyListResponse } from "@/types/platform";
import { createProxySchema } from "@/validations/platform.validations";

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams.toString();
    const path = qs
      ? `/api/v1/platform/proxies?${qs}`
      : "/api/v1/platform/proxies";
    const data = await authenticatedApiFetch<PlatformProxyListResponse>(path, {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load proxies");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = createProxySchema.parse(await req.json());
    const data = await authenticatedApiFetch("/api/v1/platform/proxies", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to create proxy");
  }
}
