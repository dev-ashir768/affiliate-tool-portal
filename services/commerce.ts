import type {
  AnalyticsOverview,
  DiscoveryProfile,
  ShopOrderRow,
} from "@/types/commerce";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function searchDiscovery(
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
    region?: string;
    minFollowers?: number;
  } = {},
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const res = await fetch(`/api/discovery/creators?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as {
    data: DiscoveryProfile[];
    meta: { total: number; page: number; pageSize: number };
  };
}

export async function saveDiscoveryToCrm(id: string) {
  const res = await fetch(`/api/discovery/creators/${encodeURIComponent(id)}/save`, {
    method: "POST",
    credentials: "include",
  });
  return parseJson(res);
}

export async function fetchOrders(signal?: AbortSignal) {
  const res = await fetch("/api/orders", { credentials: "include", signal });
  return (await parseJson(res)) as { orders: ShopOrderRow[] };
}

export async function createOrder(body: {
  externalOrderId: string;
  gmvCents: number;
  currency?: string;
  status?: string;
  orderedAt: string;
  creatorId?: string | null;
  commissionCents?: number;
}) {
  const res = await fetch("/api/orders", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function fetchAnalyticsOverview(signal?: AbortSignal) {
  const res = await fetch("/api/analytics/overview", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as AnalyticsOverview;
}

export async function fetchPlatformDiscovery(
  params: { page?: number; pageSize?: number; search?: string } = {},
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const res = await fetch(`/api/platform/discovery?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as {
    data: DiscoveryProfile[];
    meta: { total: number; page: number; pageSize: number };
  };
}

export async function createPlatformDiscovery(body: {
  handle: string;
  displayName?: string | null;
  region?: "US" | "UK" | null;
  followerCount?: number | null;
  bio?: string | null;
}) {
  const res = await fetch("/api/platform/discovery", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as DiscoveryProfile;
}
