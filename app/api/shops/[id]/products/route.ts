import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const pageToken = req.nextUrl.searchParams.get("pageToken");
    const pageSize = req.nextUrl.searchParams.get("pageSize");
    const status = req.nextUrl.searchParams.get("status");
    const qs = new URLSearchParams();
    if (pageToken) qs.set("pageToken", pageToken);
    if (pageSize) qs.set("pageSize", pageSize);
    if (status) qs.set("status", status);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const data = await authenticatedApiFetch(
      `/api/v1/shops/${encodeURIComponent(id)}/products${suffix}`,
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load shop products");
  }
}
