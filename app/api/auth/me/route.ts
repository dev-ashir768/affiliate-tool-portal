import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { MeResponse } from "@/types/auth";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<MeResponse>("/api/v1/auth/me", {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load session");
  }
}
