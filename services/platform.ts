import type {
  AdminNavItem,
  AdminNavResponse,
  BillingOverview,
  PlatformCrawlerRunResult,
  PlatformCrawlerStatus,
  PlatformListParams,
  PlatformOrgDetail,
  PlatformOrgListResponse,
  PlatformProxy,
  PlatformProxyListResponse,
  PlatformRole,
  PlatformShopListResponse,
  PlatformStaff,
  PlatformStaffListResponse,
} from "@/types/platform";
import type {
  CreateProxySchemaType,
  CreateStaffSchemaType,
  PatchProxySchemaType,
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
  const res = await fetch(
    `/api/platform/organizations/${encodeURIComponent(id)}`,
    {
      credentials: "include",
      signal,
    },
  );
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

export async function fetchPlatformProxies(
  params: PlatformListParams = { page: 1, pageSize: 50 },
  signal?: AbortSignal,
): Promise<PlatformProxyListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/platform/proxies?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformProxyListResponse;
}

export async function createPlatformProxy(
  body: CreateProxySchemaType,
): Promise<PlatformProxy> {
  const res = await fetch("/api/platform/proxies", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as PlatformProxy;
}

export async function patchPlatformProxy(
  id: string,
  body: PatchProxySchemaType,
): Promise<PlatformProxy> {
  const res = await fetch(`/api/platform/proxies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as PlatformProxy;
}

export async function fetchPlatformCrawler(
  signal?: AbortSignal,
): Promise<PlatformCrawlerStatus> {
  const res = await fetch("/api/platform/crawler", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as PlatformCrawlerStatus;
}

export async function runPlatformCrawlerDryCheck(): Promise<PlatformCrawlerRunResult> {
  const res = await fetch("/api/platform/crawler/run", {
    method: "POST",
    credentials: "include",
  });
  return (await parseJson(res)) as PlatformCrawlerRunResult;
}

export async function fetchAdminNavigation(
  area: "dashboard" | "backoffice",
  signal?: AbortSignal,
): Promise<AdminNavResponse> {
  const res = await fetch(
    `/api/platform/navigation?area=${encodeURIComponent(area)}`,
    { credentials: "include", signal },
  );
  return (await parseJson(res)) as AdminNavResponse;
}

export async function createAdminNavItem(body: {
  sectionId: string;
  key: string;
  label: string;
  href: string;
  icon: string;
  sortOrder?: number;
  badge?: string | null;
  enabled?: boolean;
  allowedPlatformRoles?: PlatformRole[];
}): Promise<AdminNavItem> {
  const res = await fetch("/api/platform/navigation/items", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as AdminNavItem;
}

export async function patchAdminNavItem(
  id: string,
  body: Partial<{
    label: string;
    href: string;
    icon: string;
    sortOrder: number;
    badge: string | null;
    enabled: boolean;
    allowedPlatformRoles: PlatformRole[];
  }>,
): Promise<AdminNavItem> {
  const res = await fetch(
    `/api/platform/navigation/items/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return (await parseJson(res)) as AdminNavItem;
}
