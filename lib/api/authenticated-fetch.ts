import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { inspectAccessToken } from "@/lib/auth/access-token";
import {
  getAccessToken,
  refreshSessionFromCookies,
} from "@/lib/auth/session";

/** Code the client watches for to send the user back to /login. */
export const SESSION_EXPIRED = "SESSION_EXPIRED";

function sessionExpired() {
  return new ApiClientError(401, SESSION_EXPIRED, "Session expired");
}

/** Valid access token from cookies, rotating via the refresh cookie when needed. */
async function ensureAccessToken(): Promise<string> {
  const current = await getAccessToken();
  if (current) {
    const inspected = await inspectAccessToken(current);
    if (inspected.status === "valid") return current;
    if (inspected.status === "misconfigured") {
      throw new ApiClientError(
        500,
        "INTERNAL",
        "Portal cannot verify session tokens. Check JWT_PUBLIC_KEY / JWT_ACCESS_SECRET."
      );
    }
  }
  const rotated = await refreshSessionFromCookies();
  if (rotated.ok) return rotated.accessToken;
  if (rotated.reason === "unauthorized") throw sessionExpired();
  throw new ApiClientError(503, "SERVICE_UNAVAILABLE", "Could not refresh session");
}

/**
 * BFF → API call with the session's access token. Route Handlers are outside
 * the proxy matcher, so this refreshes an expired token itself and retries once
 * if the API still answers 401 (e.g. token revoked mid-flight).
 */
export async function authenticatedApiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const accessToken = await ensureAccessToken();
  try {
    return await apiFetch<T>(path, { ...init, accessToken });
  } catch (err) {
    // Only the API's own auth rejection means "token no longer valid"; other
    // 401s (e.g. an upstream TikTok error) must not rotate the session.
    if (
      !(err instanceof ApiClientError) ||
      err.status !== 401 ||
      err.code !== "UNAUTHORIZED"
    ) {
      throw err;
    }
    const rotated = await refreshSessionFromCookies();
    if (!rotated.ok) {
      if (rotated.reason === "unauthorized") throw sessionExpired();
      throw new ApiClientError(503, "SERVICE_UNAVAILABLE", "Could not refresh session");
    }
    return apiFetch<T>(path, { ...init, accessToken: rotated.accessToken });
  }
}
