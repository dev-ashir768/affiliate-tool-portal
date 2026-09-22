import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET() {
  try {
    const data = await authenticatedApiFetch("/api/v1/invites");
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load invites");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sync = Boolean((body as { sync?: boolean }).sync);
    const data = await authenticatedApiFetch("/api/v1/invites", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: sync ? 201 : 202 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to create invite");
  }
}
