import type {
  AffiliateInvite,
  ShopProductSummary,
} from "@/types/invites";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchAffiliateInvites(signal?: AbortSignal) {
  const res = await fetch("/api/invites", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { invites: AffiliateInvite[] };
}

export async function fetchInviteProducts(
  shopId: string,
  opts?: { pageToken?: string | null; pageSize?: number; signal?: AbortSignal },
) {
  const qs = new URLSearchParams({ shopId });
  if (opts?.pageToken) qs.set("pageToken", opts.pageToken);
  if (opts?.pageSize) qs.set("pageSize", String(opts.pageSize));
  const res = await fetch(`/api/invites/products?${qs}`, {
    credentials: "include",
    signal: opts?.signal,
  });
  return (await parseJson(res)) as {
    products: ShopProductSummary[];
    nextPageToken: string | null;
  };
}

export async function createAffiliateInvite(body: {
  shopId: string;
  campaignId?: string | null;
  name: string;
  message?: string | null;
  endAt: string;
  sellerContactEmail?: string | null;
  hasFreeSample?: boolean;
  sampleApprovalExempt?: boolean;
  products: Array<{
    id: string;
    commissionPercent: number;
    shopAdsCommissionPercent?: number;
  }>;
  creatorIds?: string[];
  listId?: string;
  sync?: boolean;
}) {
  const res = await fetch("/api/invites", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as {
    invite: AffiliateInvite;
    skipped: Array<{ creatorId: string; handle: string; reason: string }>;
    list?: {
      listId: string;
      listName: string;
      totalMembers: number;
      truncated: boolean;
    } | null;
    sent: number;
    failed: number;
    conflicts: number;
    jobId: string | null;
    status: "QUEUED" | "SENT" | "PARTIAL" | "FAILED";
    queue?: string;
  };
}
