import type {
  CreatorConversation,
  CreatorImMessage,
} from "@/types/messages";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchConversations(
  shopId: string,
  opts?: { sync?: boolean; signal?: AbortSignal },
) {
  const qs = new URLSearchParams({ shopId });
  if (opts?.sync === false) qs.set("sync", "false");
  const res = await fetch(`/api/messages/conversations?${qs}`, {
    credentials: "include",
    signal: opts?.signal,
  });
  return (await parseJson(res)) as {
    conversations: CreatorConversation[];
    nextPageToken: string | null;
    hasMore: boolean;
    synced: boolean;
  };
}

export async function openConversation(body: {
  shopId: string;
  creatorId: string;
}) {
  const res = await fetch("/api/messages/conversations", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as {
    conversation: CreatorConversation;
    isNew: boolean;
  };
}

export async function fetchConversationMessages(
  conversationId: string,
  opts?: { sync?: boolean; signal?: AbortSignal },
) {
  const qs = new URLSearchParams();
  if (opts?.sync === false) qs.set("sync", "false");
  const q = qs.toString();
  const res = await fetch(
    `/api/messages/conversations/${encodeURIComponent(conversationId)}/messages${q ? `?${q}` : ""}`,
    { credentials: "include", signal: opts?.signal },
  );
  return (await parseJson(res)) as {
    conversationId: string;
    externalConversationId: string;
    messages: CreatorImMessage[];
    nextPageToken: string | null;
    hasMore: boolean;
    synced: boolean;
  };
}

export async function sendImMessage(conversationId: string, text: string) {
  const res = await fetch(
    `/api/messages/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    },
  );
  return (await parseJson(res)) as CreatorImMessage;
}

export async function markConversationsRead(body: {
  shopId: string;
  conversationIds: string[];
}) {
  const res = await fetch("/api/messages/mark-read", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as { ok: true; marked: number };
}
