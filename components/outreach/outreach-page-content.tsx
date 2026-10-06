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

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxLabel } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
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
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const messages = messagesQuery.data?.messages ?? [];
  const saving = createTemplate.isPending || patchTemplate.isPending;
  const delivery = emailStatus.data;
  const sendBlocked = delivery?.ready === false;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Outreach"
        description={
          <>
            Email templates with {"{{handle}}"} / {"{{displayName}}"} tokens.
            Single or bulk send to CRM creators.
          </>
        }
      />

      {/* Shown only when sending is limited; healthy email needs no banner. */}
      {delivery && !delivery.ready ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span className="font-medium">
            Email sending isn&apos;t available right now.
          </span>{" "}
          Please contact support.
        </div>
      ) : delivery && !delivery.live ? (
        <div className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Test mode:</span>{" "}
          emails are recorded but not delivered to creators.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title={editingId ? "Edit template" : "New template"}
          description="Pick an existing template to edit, or write a new one."
          actions={
            editingId ? (
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
            ) : undefined
          }
        >
          <form
            onSubmit={(e) => void onSaveTemplate(e)}
            className="flex h-full flex-col gap-4"
          >
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
            <Field>
              <FieldLabel htmlFor="template-name">Template name</FieldLabel>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="template-subject">Subject</FieldLabel>
              <Input
                id="template-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="template-body">Body</FieldLabel>
              <Textarea
                id="template-body"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={7}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              className="mt-auto self-end"
              disabled={saving}
            >
              {editingId ? "Update template" : "Save template"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          title="Send"
          description="Send to one creator, or queue a bulk send to a list or selection."
        >
          <div className="flex flex-col gap-5">
            <FormGrid columns={2}>
              <Field>
                <FieldLabel>Template</FieldLabel>
                <AppReactSelect
                  options={templateOptions}
                  value={stringSelectValue(templateOptions, templateId)}
                  onChange={(opt) =>
                    setTemplateId(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={templates.length > 8}
                  aria-label="Outreach template"
                />
              </Field>
              <Field>
                <FieldLabel>Campaign</FieldLabel>
                <AppReactSelect
                  options={campaignOptions}
                  value={stringSelectValue(campaignOptions, campaignId)}
                  onChange={(opt) =>
                    setCampaignId(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={campaigns.length > 8}
                  aria-label="Campaign"
                />
              </Field>
            </FormGrid>

            <form
              onSubmit={(e) => void onSend(e)}
              className="flex flex-col gap-2 rounded-lg border p-4"
            >
              <FieldLabel>Single creator</FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <AppReactSelect
                  className="min-w-0 flex-1"
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
                  size="lg"
                  disabled={send.isPending || sendBlocked}
                >
                  {send.isPending ? "Sending…" : "Send one"}
                </Button>
              </div>
            </form>

            <div className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  Bulk ({listId ? "using list" : `${selectedIds.size} selected`})
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={selectAllWithEmail}
                >
                  Select all with email ({withEmail.length})
                </Button>
              </div>
              <Field>
                <FieldLabel>Creator list (optional)</FieldLabel>
                <AppReactSelect
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
              </Field>
              <div className="max-h-48 overflow-y-auto rounded-lg border">
                {creators.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">
                    No CRM creators yet.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {creators.map((c) => (
                      <li key={c.id} className="px-3 py-2">
                        <CheckboxLabel
                          checked={selectedIds.has(c.id)}
                          disabled={!c.contactEmail}
                          onChange={() => toggleCreator(c.id)}
                        >
                          @{c.handle}
                          <span className="text-muted-foreground">
                            {" · "}
                            {c.contactEmail ?? "no email"}
                          </span>
                        </CheckboxLabel>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={
                    bulkSend.isPending || selectedIds.size === 0 || sendBlocked
                  }
                  onClick={() => void onBulk(true)}
                >
                  Send bulk now
                </Button>
                <Button
                  type="button"
                  size="lg"
                  disabled={
                    bulkSend.isPending || selectedIds.size === 0 || sendBlocked
                  }
                  onClick={() => void onBulk(false)}
                >
                  {bulkSend.isPending ? "Queuing…" : "Queue bulk send"}
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent messages"
        description="Latest outreach emails and their status."
        contentClassName="px-0"
      >
        {messages.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No outreach yet.
          </p>
        ) : (
          <ul className="divide-y">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.subject}</p>
                  <p className="truncate text-muted-foreground">
                    @{m.creatorHandle}
                    {m.toEmail ? ` · ${m.toEmail}` : ""}
                  </p>
                </div>
                <Badge variant="outline" className="self-start rounded-md sm:self-center">
                  {m.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
