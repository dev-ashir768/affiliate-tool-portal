import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import {
  clearSessionCookies,
  getRefreshToken,
  setSessionCookies,
} from "@/lib/auth/session";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
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

    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    await clearSessionCookies();
    if (err instanceof ApiClientError) {
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
