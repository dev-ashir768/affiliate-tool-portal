import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { getAccessToken } from "@/lib/auth/session";

export async function authenticatedApiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new ApiClientError(401, "UNAUTHORIZED", "Not authenticated");
  }
  return apiFetch<T>(path, { ...init, accessToken });
}
