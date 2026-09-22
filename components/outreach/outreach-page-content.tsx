"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useBulkSendOutreach,
  useCampaigns,
  useCreateOutreachTemplate,
  useCreatorLists,
  useCreators,
  useOutreachEmailStatus,
  useOutreachMessages,
  useOutreachTemplates,
  usePatchOutreachTemplate,
  useSendOutreach,
} from "@/hooks/use-creators";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";

export function OutreachPageContent() {
  const templatesQuery = useOutreachTemplates();
  const messagesQuery = useOutreachMessages();
  const creatorsQuery = useCreators();
  const listsQuery = useCreatorLists();
  const campaignsQuery = useCampaigns();
  const emailStatus = useOutreachEmailStatus();
  const createTemplate = useCreateOutreachTemplate();
  const patchTemplate = usePatchOutreachTemplate();
  const send = useSendOutreach();
  const bulkSend = useBulkSendOutreach();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Collab with {{displayName}}");
  const [bodyText, setBodyText] = useState(
    "Hi {{displayName}} (@{{handle}}),\n\nWe'd love to invite you to our TikTok Shop campaign.\n\n— Team",
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [listId, setListId] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const creators = useMemo(
    () => creatorsQuery.data?.creators ?? [],
    [creatorsQuery.data?.creators],
  );
  const withEmail = useMemo(
    () => creators.filter((c) => Boolean(c.contactEmail)),
    [creators],
  );

  const templates = useMemo(
    () => templatesQuery.data?.templates ?? [],
    [templatesQuery.data?.templates],
  );
  const campaigns = useMemo(
    () => campaignsQuery.data?.campaigns ?? [],
    [campaignsQuery.data?.campaigns],
  );

  const templateOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Use form subject/body" },
      ...templates.map((t) => ({ value: t.id, label: t.name })),
    ],
    [templates],
  );

  const campaignOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "No campaign" },
      ...campaigns.map((c) => ({ value: c.id, label: c.name })),
    ],
    [campaigns],
  );

  const listOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "No list (pick creators)" },
      ...(listsQuery.data?.lists ?? []).map((l) => ({
        value: l.id,
        label: `${l.name} (${l.memberCount})`,
      })),
    ],
    [listsQuery.data?.lists],
  );

  const creatorOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Single creator…" },
      ...creators.map((c) => ({
        value: c.id,
        label: `@${c.handle}${c.contactEmail ? "" : " (no email)"}`,
      })),
    ],
    [creators],
  );

  function loadTemplate(id: string) {
    const t = (templatesQuery.data?.templates ?? []).find((x) => x.id === id);
    if (!t) return;
    setEditingId(t.id);
    setName(t.name);
    setSubject(t.subject);
    setBodyText(t.bodyText);
  }

  function toggleCreator(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllWithEmail() {
    setSelectedIds(new Set(withEmail.map((c) => c.id)));
  }

  async function onSaveTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !bodyText.trim()) return;
    try {
      if (editingId) {
        await patchTemplate.mutateAsync({
          id: editingId,
          body: {
            name: name.trim(),
            subject: subject.trim(),
            bodyText,
          },
        });
        toast.success("Template updated");
      } else {
        await createTemplate.mutateAsync({
          name: name.trim(),
          subject: subject.trim(),
          bodyText,
        });
        toast.success("Template saved");
      }
      setEditingId(null);
      setName("");
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
        campaignId: campaignId || null,
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

  async function onBulk(sync: boolean) {
    if (!listId && selectedIds.size === 0) {
      toast.error("Select a list or at least one creator");
      return;
    }
    try {
      const result = await bulkSend.mutateAsync({
        ...(listId ? { listId } : { creatorIds: [...selectedIds] }),
        templateId: templateId || undefined,
        campaignId: campaignId || null,
        subject: templateId ? undefined : subject,
        bodyText: templateId ? undefined : bodyText,
        sync,
      });
      const truncated = result.list?.truncated
        ? ` (list had ${result.list.totalMembers}, capped at 100)`
        : "";
      if (result.jobId) {
        toast.success(
          `Queued ${result.queued} emails` +
            (result.skippedNoEmail
              ? ` (${result.skippedNoEmail} skipped, no email)`
              : "") +
            truncated,
        );
      } else {
        toast.success(
          `Sent ${result.sent}, failed ${result.failed}` +
            (result.skippedNoEmail
              ? `, skipped ${result.skippedNoEmail} (no email)`
              : "") +
            truncated,
        );
      }
      void messagesQuery.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk send failed");
    }
  }

  if (templatesQuery.isLoading || creatorsQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const messages = messagesQuery.data?.messages ?? [];
  const saving = createTemplate.isPending || patchTemplate.isPending;
  const delivery = emailStatus.data;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Outreach</h1>
        <p className="text-sm text-muted-foreground">
          Email templates with {"{{handle}}"} / {"{{displayName}}"} tokens.
          Single or bulk send to CRM creators.
        </p>
      </div>

      {delivery ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            delivery.ready
              ? "border-border bg-muted/30 text-muted-foreground"
              : "border-destructive/40 bg-destructive/5 text-destructive"
          }`}
        >
          <span className="font-medium text-foreground">
            Email: {delivery.provider}
          </span>
          {" · "}
          {delivery.note}
          {!delivery.live && delivery.ready ? (
            <span> (dev log only)</span>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={(e) => void onSaveTemplate(e)} className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold">
            {editingId ? "Edit template" : "New template"}
          </h2>
          {editingId ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
            >
              Cancel edit
            </Button>
          ) : null}
        </div>
        {templates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <Button
                key={t.id}
                type="button"
                size="sm"
                variant={editingId === t.id ? "default" : "outline"}
                onClick={() => loadTemplate(t.id)}
              >
                {t.name}
              </Button>
            ))}
          </div>
        ) : null}
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
        <Button type="submit" disabled={saving}>
          {editingId ? "Update template" : "Save template"}
        </Button>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Send</h2>
        <div className="flex flex-wrap gap-2">
          <AppReactSelect
            className="min-w-48"
            options={templateOptions}
            value={stringSelectValue(templateOptions, templateId)}
            onChange={(opt) =>
              setTemplateId(opt?.value ? String(opt.value) : "")
            }
            isSearchable={templates.length > 8}
            aria-label="Outreach template"
          />
          <AppReactSelect
            className="min-w-40"
            options={campaignOptions}
            value={stringSelectValue(campaignOptions, campaignId)}
            onChange={(opt) =>
              setCampaignId(opt?.value ? String(opt.value) : "")
            }
            isSearchable={campaigns.length > 8}
            aria-label="Campaign"
          />
          <AppReactSelect
            className="min-w-48"
            options={listOptions}
            value={stringSelectValue(listOptions, listId)}
            onChange={(opt) => {
              const next = opt?.value ? String(opt.value) : "";
              setListId(next);
              if (next) setSelectedIds(new Set());
            }}
            isSearchable={(listsQuery.data?.lists?.length ?? 0) > 8}
            aria-label="Creator list"
          />
        </div>

        <form onSubmit={(e) => void onSend(e)} className="flex flex-wrap gap-2">
          <AppReactSelect
            className="min-w-48"
            options={creatorOptions}
            value={stringSelectValue(creatorOptions, creatorId)}
            onChange={(opt) =>
              setCreatorId(opt?.value ? String(opt.value) : "")
            }
            isSearchable
            aria-label="Single creator"
          />
          <Button
            type="submit"
            disabled={send.isPending || delivery?.ready === false}
          >
            {send.isPending ? "Sending…" : "Send one"}
          </Button>
        </form>

        <div className="space-y-2 rounded-xl border border-border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium">
              Bulk ({listId ? "using list" : `${selectedIds.size} selected`})
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={selectAllWithEmail}
            >
              Select all with email ({withEmail.length})
            </Button>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto text-sm">
            {creators.length === 0 ? (
              <p className="text-muted-foreground">No CRM creators yet.</p>
            ) : (
              creators.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.id)}
                    disabled={!c.contactEmail}
                    onChange={() => toggleCreator(c.id)}
                  />
                  <span>
                    @{c.handle}
                    {!c.contactEmail ? (
                      <span className="text-muted-foreground"> · no email</span>
                    ) : (
                      <span className="text-muted-foreground">
                        {" "}
                        · {c.contactEmail}
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={
                bulkSend.isPending ||
                selectedIds.size === 0 ||
                delivery?.ready === false
              }
              onClick={() => void onBulk(false)}
            >
              {bulkSend.isPending ? "Queuing…" : "Queue bulk send"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={
                bulkSend.isPending ||
                selectedIds.size === 0 ||
                delivery?.ready === false
              }
              onClick={() => void onBulk(true)}
            >
              Send bulk now
            </Button>
          </div>
        </div>
      </section>

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
                  {m.toEmail ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {m.toEmail}
                    </span>
                  ) : null}
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
