import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<unknown>("/api/v1/auth/2fa/status", {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load 2FA status");
  }
}
