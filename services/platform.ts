import type {
  BillingOverview,
  PlatformListParams,
  PlatformOrgDetail,
  PlatformOrgListResponse,
  PlatformShopListResponse,
  PlatformStaff,
  PlatformStaffListResponse,
} from "@/types/platform";
import type {
  CreateStaffSchemaType,
  PatchStaffSchemaType,
} from "@/validations/platform.validations";

function toQuery(params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchPlatformStaff(
  params: PlatformListParams,
  signal?: AbortSignal,
): Promise<PlatformStaffListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/platform/staff?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformStaffListResponse;
}

export async function createPlatformStaff(
  body: CreateStaffSchemaType,
): Promise<PlatformStaff> {
  const res = await fetch("/api/platform/staff", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as PlatformStaff;
}

export async function patchPlatformStaff(
  id: string,
  body: PatchStaffSchemaType,
): Promise<PlatformStaff> {
  const res = await fetch(`/api/platform/staff/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as PlatformStaff;
}

export async function fetchPlatformOrganizations(
  params: PlatformListParams,
  signal?: AbortSignal,
): Promise<PlatformOrgListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/platform/organizations?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformOrgListResponse;
}

export async function fetchPlatformOrganization(
  id: string,
  signal?: AbortSignal,
): Promise<PlatformOrgDetail> {
  const res = await fetch(`/api/platform/organizations/${encodeURIComponent(id)}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformOrgDetail;
}

export async function fetchPlatformShops(
  params: PlatformListParams,
  signal?: AbortSignal,
): Promise<PlatformShopListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/platform/shops?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformShopListResponse;
}

export async function fetchBillingOverview(
  signal?: AbortSignal,
): Promise<BillingOverview> {
  const res = await fetch("/api/platform/billing/overview", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as BillingOverview;
}

export async function fetchPlatformProxies(signal?: AbortSignal) {
  const res = await fetch("/api/platform/proxies", {
    credentials: "include",
    signal,
  });
  return parseJson(res) as Promise<{
    items: unknown[];
    meta: { total: number; note: string };
  }>;
}

export async function fetchPlatformCrawler(signal?: AbortSignal) {
  const res = await fetch("/api/platform/crawler", {
    credentials: "include",
    signal,
  });
  return parseJson(res) as Promise<{
    status: string;
    lastRunAt: string | null;
    note: string;
  }>;
}
