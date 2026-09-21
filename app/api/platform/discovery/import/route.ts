import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await authenticatedApiFetch(
      "/api/v1/platform/discovery/import",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to import discovery profiles");
  }
}
