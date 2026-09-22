async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export type SampleRequestRow = {
  id: string;
  shopId: string;
  shopName: string | null;
  shopRegion: string | null;
  creatorId: string | null;
  creatorHandle: string | null;
  creatorDisplayName: string | null;
  affiliateInviteId: string | null;
  externalApplicationId: string | null;
  externalProductId: string | null;
  productTitle: string | null;
  creatorUsername: string | null;
  creatorOpenId: string | null;
  status: string;
  reviewNote: string | null;
  lastError: string | null;
  requestedAt: string | null;
  reviewedAt: string | null;
  fulfilledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchSamples(
  params: { status?: string; shopId?: string } = {},
  signal?: AbortSignal,
) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) qs.set(k, v);
  }
  const res = await fetch(`/api/samples?${qs}`, {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { samples: SampleRequestRow[] };
}

export async function syncSamples(body: { shopId: string; maxPages?: number }) {
  const res = await fetch("/api/samples/sync", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as {
    shopId: string;
    pages: number;
    imported: number;
    updated: number;
  };
}

export async function reviewSample(
  id: string,
  body: { action: "APPROVE" | "REJECT"; note?: string | null },
) {
  const res = await fetch(`/api/samples/${encodeURIComponent(id)}/review`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as SampleRequestRow;
}

export async function refreshSampleFulfillment(id: string) {
  const res = await fetch(
    `/api/samples/${encodeURIComponent(id)}/fulfillments/refresh`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  return (await parseJson(res)) as SampleRequestRow;
}

export async function createManualSample(body: {
  shopId: string;
  creatorId?: string | null;
  productTitle?: string | null;
  note?: string | null;
}) {
  const res = await fetch("/api/samples", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as SampleRequestRow;
}
