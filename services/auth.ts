import type { MeResponse } from "@/types/auth";

export async function fetchMe(signal?: AbortSignal): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load session");
  }
  return data as MeResponse;
}
