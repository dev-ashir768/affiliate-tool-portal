import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await authenticatedApiFetch<{ backupCodes: string[] }>(
      "/api/v1/auth/2fa/backup-codes/regenerate",
      { method: "POST", body: JSON.stringify(body) },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to regenerate backup codes");
  }
}
