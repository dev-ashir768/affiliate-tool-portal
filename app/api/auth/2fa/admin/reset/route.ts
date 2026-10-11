import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await authenticatedApiFetch<void>("/api/v1/auth/2fa/admin/reset", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to reset 2FA");
  }
}
