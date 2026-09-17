import { getApiBaseUrl } from "./constants";

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
};

export async function apiFetch<T>(
  path: string,
  init: ApiFetchOptions = {}
): Promise<T> {
  const { accessToken, ...requestInit } = init;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(requestInit.headers);
  if (requestInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

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
