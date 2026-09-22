import { NextRequest, NextResponse } from "next/server";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

export async function GET() {
  try {
    const data = await authenticatedApiFetch("/api/v1/automations");
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load automations");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await authenticatedApiFetch("/api/v1/automations", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 202 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to start automation");
  }
}
