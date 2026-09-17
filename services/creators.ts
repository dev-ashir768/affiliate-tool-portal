import type { Campaign, Creator, CreatorList } from "@/types/creators";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchCreators(signal?: AbortSignal) {
  const res = await fetch("/api/creators", { credentials: "include", signal });
  return (await parseJson(res)) as { creators: Creator[] };
}

export async function createCreator(body: {
  handle: string;
  displayName?: string | null;
  region?: "US" | "UK" | null;
  stage?: string;
  notes?: string | null;
}) {
  const res = await fetch("/api/creators", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as Creator;
}

export async function patchCreator(
  id: string,
  body: Partial<{
    handle: string;
    displayName: string | null;
    stage: string;
    notes: string | null;
  }>,
) {
  const res = await fetch(`/api/creators/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as Creator;
}

export async function deleteCreator(id: string) {
  const res = await fetch(`/api/creators/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  return parseJson(res);
}

export async function fetchCreatorLists(signal?: AbortSignal) {
  const res = await fetch("/api/creators/lists", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { lists: CreatorList[] };
}

export async function createCreatorList(body: {
  name: string;
  description?: string | null;
}) {
  const res = await fetch("/api/creators/lists", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as CreatorList;
}

export async function fetchCampaigns(signal?: AbortSignal) {
  const res = await fetch("/api/creators/campaigns", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { campaigns: Campaign[] };
}

export async function createCampaign(body: {
  name: string;
  brief?: string | null;
  offerNote?: string | null;
  status?: string;
}) {
  const res = await fetch("/api/creators/campaigns", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as Campaign;
}

export async function patchCampaign(
  id: string,
  body: Partial<{ name: string; status: string; brief: string | null }>,
) {
  const res = await fetch(`/api/creators/campaigns/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as Campaign;
}
