import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/auth/api";
import { clearSessionCookies, getRefreshToken } from "@/lib/auth/session";

export async function POST() {
  const refreshToken = await getRefreshToken();
  try {
    if (refreshToken) {
      await apiFetch("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch {
    // Always clear local session even if API revoke fails
  }
  await clearSessionCookies();
  return new NextResponse(null, { status: 204 });
}
