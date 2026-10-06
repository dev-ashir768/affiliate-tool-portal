import { NextResponse } from "next/server";
import { refreshSessionFromCookies } from "@/lib/auth/session";

export async function POST() {
  const result = await refreshSessionFromCookies();
  if (result.ok) {
    return NextResponse.json({ ok: true });
  }
  if (result.reason === "unauthorized") {
    // Cookies already cleared — refresh token rejected or missing.
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Session expired" } },
      { status: 401 }
    );
  }
  if (result.reason === "misconfigured") {
    // Keep cookies: the refresh token may still be valid once config is fixed.
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL",
          message:
            "Session tokens could not be verified. PORTAL_BFF_SECRET and JWT_PUBLIC_KEY / JWT_ACCESS_SECRET must match the APIs.",
        },
      },
      { status: 502 }
    );
  }
  return NextResponse.json(
    { error: { code: "INTERNAL", message: "Refresh failed" } },
    { status: 500 }
  );
}
