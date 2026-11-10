import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

type Props = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const data = await authenticatedApiFetch(
      `/api/v1/shops/${encodeURIComponent(id)}/sync-open-collab-creators`,
      { method: "POST" },
    );
    return NextResponse.json(data, { status: 202 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to start creators sync");
  }
}
