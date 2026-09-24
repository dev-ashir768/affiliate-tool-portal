import type {
  AnalyticsOverview,
  DiscoveryProfile,
  ShopOrderRow,
} from "@/types/commerce";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message ?? "Request failed";
    const details = data?.error?.details as
      | {
          remediation?: string;
          requestId?: string | null;
          tiktokCode?: number | null;
        }
      | undefined;
    const parts = [message];
    if (details?.remediation) parts.push(details.remediation);
    if (details?.requestId) parts.push(`request_id: ${details.requestId}`);
    else if (details?.tiktokCode != null)
      parts.push(`tiktok_code: ${details.tiktokCode}`);
    throw new Error(parts.join(" — "));
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
    maxFollowers?: number;
    minUnitsSold?: number;
    gmvRangeContains?: string;
    hasEmail?: boolean;
    sortBy?: "followers" | "units" | "updated" | "gmv";
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
  const res = await fetch(
    `/api/discovery/creators/${encodeURIComponent(id)}/save`,
    {
      method: "POST",
      credentials: "include",
    },
  );
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

export async function syncAffiliateOrders(body: {
  shopId: string;
  lookbackDays?: number;
  maxPages?: number;
}) {
  const res = await fetch("/api/orders/sync", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as {
    shopId: string;
    lookbackDays: number;
    pages: number;
    imported: number;
    updated: number;
    skipped: number;
  };
}

export async function fetchAnalyticsOverview(
  params: { from?: string; to?: string } = {},
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  const suffix = qs.toString();
  const res = await fetch(
    `/api/analytics/overview${suffix ? `?${suffix}` : ""}`,
    {
      credentials: "include",
      signal,
    },
  );
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

export async function importPlatformDiscovery(
  profiles: Array<{
    handle: string;
    displayName?: string | null;
    region?: "US" | "UK" | null;
    followerCount?: number | null;
    categories?: string[];
    bio?: string | null;
    source?: string;
    enabled?: boolean;
  }>,
) {
  const res = await fetch("/api/platform/discovery/import", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profiles }),
  });
  return (await parseJson(res)) as {
    created: number;
    skipped: number;
    total: number;
  };
}

export async function fetchTikTokDiscoveryStatus(signal?: AbortSignal) {
  const res = await fetch("/api/platform/discovery/tiktok/status", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as {
    config: {
      configured: boolean;
      appConfigured?: boolean;
      envTokenConfigured?: boolean;
      appKeySet: boolean;
      appSecretSet: boolean;
      accessTokenSet: boolean;
      shopCipherSet: boolean;
      baseUrl: string;
      region: string;
      searchPath: string;
      missing: string[];
      note: string;
    };
    queue: {
      queue: string;
      counts: Record<string, number>;
      lastJobId: string | null;
      lastJobState: string | null;
      lastRunAt: string | null;
    } | null;
  };
}

export async function syncTikTokDiscovery(
  body: {
    maxPages?: number;
    keyword?: string | null;
    minFollowers?: number | null;
    pageSize?: 12 | 20;
    categoryIds?: string[] | null;
    shopId?: string | null;
    organizationId?: string | null;
    sync?: boolean;
  } = {},
) {
  const res = await fetch("/api/platform/discovery/tiktok/sync", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export type DiscoveryCrawlStatus = {
  index: {
    enabledProfiles: number;
    withOpenId: number;
    withGmvCents: number;
    keywordSeedSize: number;
    followerBands: number[];
  };
  cells: {
    byStatus: Record<string, number>;
    recent: Array<{
      cellKey: string;
      region: string;
      keyword: string;
      minFollowers: number | null;
      lastRunAt: string | null;
      lastStatus: string | null;
      lastImported: number;
      lastUpdated: number;
      lastError: string | null;
    }>;
  };
  queue: {
    name: string;
    counts: Record<string, number>;
  } | null;
  search?: {
    configured: boolean;
    reachable: boolean;
    index: string | null;
    numberOfDocuments?: number | null;
  };
  scheduler?: {
    enabled: boolean;
    cron: string;
    maxCells: number;
    skipDays: number;
    maxPages: number;
    regions: Array<{
      region: string;
      organizationId: string;
      shopId: string;
      jobId: string;
    }>;
    repeatable: Array<{
      id: string | null | undefined;
      pattern: string | null | undefined;
      next: number;
      key: string;
    }>;
    queue: string;
  } | null;
};

export type DiscoveryCrawlTerm = {
  id: string;
  keyword: string;
  region: string | null;
  regionKey?: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export async function fetchDiscoveryCrawlStatus(signal?: AbortSignal) {
  const res = await fetch("/api/platform/discovery/crawl/status", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as DiscoveryCrawlStatus;
}

export async function planDiscoveryCrawl(body: {
  shopId: string;
  organizationId: string;
  region?: "US" | "UK";
  skipDays?: number;
  maxPages?: number;
  maxCells?: number;
  sync?: boolean;
}) {
  const res = await fetch("/api/platform/discovery/crawl/plan", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function refreshDiscoveryCrawlMetrics(body: {
  shopId: string;
  organizationId: string;
  limit?: number;
  olderThanHours?: number;
  sync?: boolean;
}) {
  const res = await fetch("/api/platform/discovery/crawl/metrics-refresh", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function fetchCrawlTerms(
  params: {
    page?: number;
    pageSize?: number;
    search?: string;
    region?: string;
    enabled?: boolean;
  } = {},
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const res = await fetch(`/api/platform/discovery/crawl/terms?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as {
    data: DiscoveryCrawlTerm[];
    meta: { total: number; page: number; pageSize: number };
  };
}

export async function createCrawlTerm(body: {
  keyword: string;
  region?: "US" | "UK" | null;
  enabled?: boolean;
  sortOrder?: number;
}) {
  const res = await fetch("/api/platform/discovery/crawl/terms", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as DiscoveryCrawlTerm;
}

export async function patchCrawlTerm(
  id: string,
  body: {
    keyword?: string;
    region?: "US" | "UK" | null;
    enabled?: boolean;
    sortOrder?: number;
  },
) {
  const res = await fetch(`/api/platform/discovery/crawl/terms/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as DiscoveryCrawlTerm;
}

export async function deleteCrawlTerm(id: string) {
  const res = await fetch(`/api/platform/discovery/crawl/terms/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return parseJson(res);
}

export async function seedCrawlTerms() {
  const res = await fetch("/api/platform/discovery/crawl/terms/seed", {
    method: "POST",
    credentials: "include",
  });
  return (await parseJson(res)) as { seeded: number; total: number };
}

export async function registerCrawlScheduler() {
  const res = await fetch("/api/platform/discovery/crawl/scheduler", {
    method: "POST",
    credentials: "include",
  });
  return parseJson(res);
}

export async function reindexDiscoverySearch() {
  const res = await fetch("/api/platform/discovery/search/reindex", {
    method: "POST",
    credentials: "include",
  });
  return (await parseJson(res)) as {
    indexed: number;
    engine: "meilisearch" | "disabled";
  };
}

export async function fetchOrgDiscoveryTikTokStatus(signal?: AbortSignal) {
  const res = await fetch("/api/discovery/tiktok/status", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as {
    config: {
      configured: boolean;
      appConfigured?: boolean;
      envTokenConfigured?: boolean;
      missing: string[];
      note: string;
    };
    shops: Array<{
      id: string;
      displayName: string | null;
      region: "US" | "UK";
      status: string;
      oauthConnected: boolean;
      externalShopId: string | null;
      hasCreatorMarketplaceScope: boolean;
    }>;
  };
}

export async function syncOrgDiscoveryFromTikTok(body: {
  shopId: string;
  maxPages?: number;
  keyword?: string | null;
  minFollowers?: number | null;
  pageSize?: 12 | 20;
  categoryIds?: string[] | null;
  propagateCrm?: boolean;
  sync?: boolean;
}) {
  const res = await fetch("/api/discovery/tiktok/sync", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}

export async function refreshOrgCrmCreatorMetrics(body: {
  shopId: string;
  limit?: number;
  sync?: boolean;
}) {
  const res = await fetch("/api/discovery/tiktok/refresh-crm-metrics", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res) as Promise<
    | { jobId: string; queue: string; status: "QUEUED" }
    | { refreshed: number; skipped: number; failed: number }
  >;
}
