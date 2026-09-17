"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useCreateOutreachTemplate,
  useCreators,
  useOutreachMessages,
  useOutreachTemplates,
  useSendOutreach,
} from "@/hooks/use-creators";

export function OutreachPageContent() {
  const templatesQuery = useOutreachTemplates();
  const messagesQuery = useOutreachMessages();
  const creatorsQuery = useCreators();
  const createTemplate = useCreateOutreachTemplate();
  const send = useSendOutreach();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Collab with {{displayName}}");
  const [bodyText, setBodyText] = useState(
    "Hi {{displayName}} (@{{handle}}),\n\nWe'd love to invite you to our TikTok Shop campaign.\n\n— Team",
  );
  const [templateId, setTemplateId] = useState("");
  const [creatorId, setCreatorId] = useState("");

  async function onCreateTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !bodyText.trim()) return;
    try {
      await createTemplate.mutateAsync({
        name: name.trim(),
        subject: subject.trim(),
        bodyText,
      });
      setName("");
      toast.success("Template saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!creatorId) {
      toast.error("Pick a creator");
      return;
    }
    try {
      const msg = await send.mutateAsync({
        creatorId,
        templateId: templateId || undefined,
        subject: templateId ? undefined : subject,
        bodyText: templateId ? undefined : bodyText,
      });
      if (msg.status === "SENT") toast.success("Outreach sent");
      else if (msg.status === "FAILED")
        toast.error(msg.lastError ?? "Outreach failed");
      else toast.message(`Outreach ${msg.status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    }
  }

  if (templatesQuery.isLoading || creatorsQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const templates = templatesQuery.data?.templates ?? [];
  const creators = creatorsQuery.data?.creators ?? [];
  const messages = messagesQuery.data?.messages ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Outreach</h1>
        <p className="text-sm text-muted-foreground">
          Email templates with {"{{handle}}"} / {"{{displayName}}"} tokens.
          Sends via your EMAIL_PROVIDER (console or SMTP).
        </p>
      </div>

      <form onSubmit={(e) => void onCreateTemplate(e)} className="space-y-3">
        <h2 className="text-sm font-semibold">New template</h2>
        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
        />
        <Button type="submit" disabled={createTemplate.isPending}>
          Save template
        </Button>
      </form>

      <form onSubmit={(e) => void onSend(e)} className="space-y-3">
        <h2 className="text-sm font-semibold">Send</h2>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-md border border-border bg-background px-2 py-2 text-sm"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
          >
            <option value="">Creator…</option>
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                @{c.handle}
                {c.contactEmail ? "" : " (no email)"}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-border bg-background px-2 py-2 text-sm"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="">Use form subject/body</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={send.isPending}>
            {send.isPending ? "Sending…" : "Send"}
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Recent messages</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No outreach yet.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span>
                  @{m.creatorHandle} · {m.subject}
                </span>
                <Badge variant="outline" className="rounded-md">
                  {m.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
