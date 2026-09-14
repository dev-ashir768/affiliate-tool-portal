import type {
  UsersExportParams,
  UsersListParams,
  UsersListResponse,
} from "@/types/users";

function toQuery(params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

export async function fetchUsers(
  params: UsersListParams,
  signal?: AbortSignal,
): Promise<UsersListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/users?${qs}`, { signal });
  if (!res.ok) throw new Error("Unable to load users");
  return res.json() as Promise<UsersListResponse>;
}

export async function exportUsers(params: UsersExportParams): Promise<Blob> {
  const qs = toQuery(params);
  const res = await fetch(`/api/users/export?${qs}`);
  if (!res.ok) throw new Error("Unable to export users");
  return res.blob();
}
