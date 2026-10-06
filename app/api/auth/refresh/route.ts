import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { inspectAccessToken } from "@/lib/auth/access-token";
import {
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/auth/session";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearSessionCookies();
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Missing refresh token" } },
        { status: 401 }
      );
    }

    const data = await apiFetch<RefreshResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    if (!data.accessToken?.trim() || !data.refreshToken?.trim()) {
      // Do not wipe cookies on BFF mismatch — the refresh token may still be valid.
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL",
            message:
              "Auth tokens missing from API. Check PORTAL_BFF_SECRET matches on portal and APIs.",
          },
        },
        { status: 502 },
      );
    }

    const inspected = await inspectAccessToken(data.accessToken);
    if (inspected.status !== "valid") {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL",
            message:
              "Refreshed token could not be verified. JWT_ACCESS_SECRET must match on portal and APIs.",
          },
        },
        { status: 502 },
      );
    }

    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiClientError) {
      if (err.status === 401 || err.status === 403) {
        await clearSessionCookies();
      }
      return NextResponse.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Refresh failed" } },
      { status: 500 }
    );
  }
}
