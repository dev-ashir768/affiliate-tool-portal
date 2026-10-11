import { headers as requestHeaders } from "next/headers";
import { getApiBaseUrl, requirePortalBffSecret } from "./constants";
import { clientIpFromHeaders } from "./client-ip";

export type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: unknown };
};

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export type ApiFetchOptions = RequestInit & {
  accessToken?: string;
  /** Browser IP to forward; read from the incoming request when omitted. */
  clientIp?: string;
};

async function incomingClientIp(): Promise<string | undefined> {
  try {
    return clientIpFromHeaders(await requestHeaders());
  } catch {
    // Outside a request scope (e.g. build) — API falls back to the socket IP.
    return undefined;
  }
}

export async function apiFetch<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<T> {
  return (await apiFetchWithHeaders<T>(path, init)).data;
}

/** Like apiFetch but also returns response headers (e.g. Set-Cookie from the API). */
export async function apiFetchWithHeaders<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<{ data: T; headers: Headers }> {
  const { accessToken, clientIp, ...requestInit } = init;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(requestInit.headers);
  if (requestInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  headers.set("X-Portal-Bff-Secret", requirePortalBffSecret());
  const ip = clientIp ?? (await incomingClientIp());
  if (ip) headers.set("X-Client-IP", ip);

  const res = await fetch(url, {
    ...requestInit,
    headers,
    credentials: "include",
  });

  if (res.status === 204) {
    return { data: undefined as T, headers: res.headers };
  }

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      data.error?.code ?? "INTERNAL",
      data.error?.message ?? "Request failed",
      data.error?.details
    );
  }
  return { data, headers: res.headers };
}

/** Value of a named cookie from the response's Set-Cookie headers, if any. */
export function setCookieValue(headers: Headers, name: string): string | null {
  for (const line of headers.getSetCookie()) {
    const pair = line.split(";", 1)[0] ?? "";
    const eq = pair.indexOf("=");
    if (eq < 0 || pair.slice(0, eq).trim() !== name) continue;
    const raw = pair.slice(eq + 1).trim();
    if (!raw) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}
