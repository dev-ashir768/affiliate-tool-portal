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
    return undefined as T;
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
  return data;
}
