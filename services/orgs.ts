import type {
  CreateInviteResponse,
  MembersListParams,
  MembersListResponse,
  OrganizationCurrent,
} from "@/types/orgs";
import type {
  CreateInviteSchemaType,
  PatchCurrentOrgSchemaType,
} from "@/validations/org.validations";

function toQuery(params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

export async function fetchCurrentOrg(
  signal?: AbortSignal,
): Promise<OrganizationCurrent> {
  const res = await fetch("/api/orgs/current", {
    method: "GET",
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load organization");
  }
  return data as OrganizationCurrent;
}

export async function patchCurrentOrg(
  body: PatchCurrentOrgSchemaType,
): Promise<OrganizationCurrent> {
  const res = await fetch("/api/orgs/current", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to update organization");
  }
  return data as OrganizationCurrent;
}

export async function fetchMembers(
  params: MembersListParams,
  signal?: AbortSignal,
): Promise<MembersListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/orgs/current/members?${qs}`, {
    method: "GET",
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Unable to load members");
  }
  return data as MembersListResponse;
}

export async function createInvite(
  body: CreateInviteSchemaType,
): Promise<CreateInviteResponse> {
  const res = await fetch("/api/orgs/current/invites", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to create invite");
  }
  return data as CreateInviteResponse;
}
