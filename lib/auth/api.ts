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

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
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
