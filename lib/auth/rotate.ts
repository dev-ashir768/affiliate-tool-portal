import { getApiBaseUrl, requirePortalBffSecret } from "./constants";
import { inspectAccessToken } from "./access-token";

export type RotateResult =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; reason: "unauthorized" | "misconfigured" | "error" };

/**
 * Concurrent callers holding the same refresh token share one API call, so
 * parallel navigations / prefetches / BFF requests never race each other into
 * a revoked token. (The API also has a short reuse grace window.)
 */
const inflight = new Map<string, Promise<RotateResult>>();

async function callRefresh(
  refreshToken: string,
  opts: { accessToken?: string; clientIp?: string }
): Promise<RotateResult> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Portal-Bff-Secret": requirePortalBffSecret(),
    };
    // Expired access token lets the API keep the session on the same org.
    if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`;
    if (opts.clientIp) headers["X-Client-IP"] = opts.clientIp;

    const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, reason: "unauthorized" };
    }
    if (!res.ok) return { ok: false, reason: "error" };
    const data = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    if (!data.accessToken || !data.refreshToken) {
      console.error(
        "[auth] refresh response missing tokens — PORTAL_BFF_SECRET likely differs from APIs"
      );
      return { ok: false, reason: "misconfigured" };
    }
    const inspected = await inspectAccessToken(data.accessToken);
    if (inspected.status !== "valid") {
      console.error(
        "[auth] refreshed access token failed verification — JWT_PUBLIC_KEY / JWT_ACCESS_SECRET likely differs from APIs"
      );
      return { ok: false, reason: "misconfigured" };
    }
    return {
      ok: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (err) {
    console.error("[auth] token refresh failed", err);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("PORTAL_BFF_SECRET")) {
      return { ok: false, reason: "misconfigured" };
    }
    return { ok: false, reason: "error" };
  }
}

export function rotateSessionTokens(
  refreshToken: string,
  opts: { accessToken?: string; clientIp?: string } = {}
): Promise<RotateResult> {
  const pending = inflight.get(refreshToken);
  if (pending) return pending;
  const p = callRefresh(refreshToken, opts).finally(() => {
    // Keep briefly so stragglers in the same burst reuse the result.
    setTimeout(() => inflight.delete(refreshToken), 5_000);
  });
  inflight.set(refreshToken, p);
  return p;
}
