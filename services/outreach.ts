import type { OutreachMessage, OutreachTemplate } from "@/types/creators";

async function parseJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Request failed");
  }
  return data;
}

export async function fetchOutreachTemplates(signal?: AbortSignal) {
  const res = await fetch("/api/outreach/templates", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { templates: OutreachTemplate[] };
}

export async function createOutreachTemplate(body: {
  name: string;
  subject: string;
  bodyText: string;
}) {
  const res = await fetch("/api/outreach/templates", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as OutreachTemplate;
}

export async function patchOutreachTemplate(
  id: string,
  body: Partial<{ name: string; subject: string; bodyText: string }>,
) {
  const res = await fetch(`/api/outreach/templates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as OutreachTemplate;
}

export async function fetchOutreachMessages(signal?: AbortSignal) {
  const res = await fetch("/api/outreach/messages", {
    credentials: "include",
    signal,
  });
  return (await parseJson(res)) as { messages: OutreachMessage[] };
}

export async function sendOutreach(body: {
  creatorId: string;
  templateId?: string;
  campaignId?: string | null;
  subject?: string;
  bodyText?: string;
}) {
  const res = await fetch("/api/outreach/send", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await parseJson(res)) as OutreachMessage;
}
