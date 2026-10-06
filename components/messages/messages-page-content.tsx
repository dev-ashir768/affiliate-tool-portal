"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCreators } from "@/hooks/use-creators";
import { useShops } from "@/hooks/use-shops";
import {
  useConversationMessages,
  useConversations,
  useMarkConversationsRead,
  useOpenConversation,
  useSendImMessage,
} from "@/hooks/use-messages";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { cn } from "cn";

import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
export function MessagesPageContent() {
  const shopsQuery = useShops();
  const creatorsQuery = useCreators();
  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );

  const [shopId, setShopId] = useState("");
  const activeShopId = shopId || oauthShops[0]?.id || null;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creatorId, setCreatorId] = useState("");
  const [draft, setDraft] = useState("");

  const conversationsQuery = useConversations(activeShopId);
  const threadQuery = useConversationMessages(selectedId);
  const openConversation = useOpenConversation();
  const sendMessage = useSendImMessage(selectedId);
  const markRead = useMarkConversationsRead();

  const creatorsWithOpenId = useMemo(
    () =>
      (creatorsQuery.data?.creators ?? []).filter((c) =>
        Boolean(c.creatorOpenId),
      ),
    [creatorsQuery.data?.creators],
  );

  const shopOptions: SelectOption[] = useMemo(
    () =>
      oauthShops.map((s) => ({
        value: s.id,
        label: `${s.displayName || s.id} (${s.region})`,
      })),
    [oauthShops],
  );

  const creatorOptions: SelectOption[] = useMemo(
    () =>
      creatorsWithOpenId.map((c) => ({
        value: c.id,
        label: `@${c.handle}${c.displayName ? ` · ${c.displayName}` : ""}`,
      })),
    [creatorsWithOpenId],
  );

  const conversations = conversationsQuery.data?.conversations ?? [];
  const messages = threadQuery.data?.messages ?? [];
  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  async function onOpenConversation(e: React.FormEvent) {
    e.preventDefault();
    if (!activeShopId || !creatorId) return;
    try {
      const result = await openConversation.mutateAsync({
        shopId: activeShopId,
        creatorId,
      });
      setSelectedId(result.conversation.id);
      toast.success(result.isNew ? "Conversation created" : "Conversation opened");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open");
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !selectedId) return;
    try {
      await sendMessage.mutateAsync(draft.trim());
      setDraft("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    }
  }

  async function onSelectConversation(id: string) {
    setSelectedId(id);
    if (!activeShopId) return;
    const conv = conversations.find((c) => c.id === id);
    if (conv && conv.unreadCount > 0) {
      try {
        await markRead.mutateAsync({
          shopId: activeShopId,
          conversationIds: [id],
        });
      } catch {
        /* non-blocking */
      }
    }
  }

  if (shopsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[28rem] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="TikTok Shop affiliate IM with creators (OpenAPI conversations). Requires IM scopes and shop OAuth."
        actions={
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!activeShopId || conversationsQuery.isFetching}
            onClick={() => void conversationsQuery.refetch()}
          >
            {conversationsQuery.isFetching ? "Syncing…" : "Sync inbox"}
          </Button>
        }
      />

      <SectionCard>
        <form
          onSubmit={(e) => void onOpenConversation(e)}
          className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-end"
        >
          <Field>
            <FieldLabel>Shop</FieldLabel>
            <AppReactSelect
              options={shopOptions}
              value={stringSelectValue(shopOptions, activeShopId ?? "")}
              onChange={(opt) => {
                setShopId(opt?.value ? String(opt.value) : "");
                setSelectedId(null);
              }}
              placeholder={
                oauthShops.length === 0 ? "Authorize a shop first" : "Shop"
              }
              isSearchable
              isDisabled={oauthShops.length === 0}
              aria-label="Shop"
            />
          </Field>
          <Field>
            <FieldLabel>Start or open a chat with a CRM creator</FieldLabel>
            <AppReactSelect
              options={creatorOptions}
              value={stringSelectValue(creatorOptions, creatorId)}
              onChange={(opt) =>
                setCreatorId(opt?.value ? String(opt.value) : "")
              }
              placeholder="Select creator with open_id"
              isClearable
              isSearchable
              aria-label="Start / open with CRM creator"
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            disabled={!creatorId || !activeShopId || openConversation.isPending}
          >
            {openConversation.isPending ? "Opening…" : "Open chat"}
          </Button>
        </form>
      </SectionCard>

      {conversationsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {conversationsQuery.error instanceof Error
            ? conversationsQuery.error.message
            : "Failed to load conversations"}
        </p>
      ) : null}

      <Card className="grid min-h-[32rem] gap-0 overflow-hidden py-0 md:grid-cols-[18rem_1fr]">
        <div className="flex min-h-0 flex-col border-b md:border-r md:border-b-0">
          <div className="border-b px-4 py-3 text-sm font-semibold">
            Conversations
          </div>
          <ul className="max-h-[32rem] flex-1 overflow-y-auto p-2 text-sm">
            {conversations.length === 0 ? (
              <li className="px-2 py-8 text-center text-muted-foreground">
                No conversations yet.
              </li>
            ) : (
              conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted",
                      selectedId === c.id && "bg-muted",
                    )}
                    onClick={() => void onSelectConversation(c.id)}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">
                        {c.creatorHandle
                          ? `@${c.creatorHandle}`
                          : c.creatorUsername || c.externalConversationId}
                      </span>
                      {c.unreadCount > 0 ? (
                        <Badge variant="default">{c.unreadCount}</Badge>
                      ) : null}
                    </span>
                    {c.lastMessagePreview ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {c.lastMessagePreview}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex min-h-[28rem] flex-col">
          {!selectedId ? (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="border-b px-4 py-3 text-sm font-semibold">
                {selected?.creatorHandle
                  ? `@${selected.creatorHandle}`
                  : selected?.creatorUsername || "Conversation"}
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
                {threadQuery.isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : threadQuery.isError ? (
                  <p className="text-sm text-destructive">
                    {threadQuery.error instanceof Error
                      ? threadQuery.error.message
                      : "Failed to load thread"}
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No messages yet.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                        m.direction === "OUTBOUND"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : m.direction === "SYSTEM"
                            ? "mx-auto bg-muted text-muted-foreground"
                            : "bg-card ring-1 ring-foreground/10",
                      )}
                    >
                      <p className="whitespace-pre-wrap">
                        {m.contentText || m.msgType}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[10px] opacity-70",
                          m.status === "FAILED" &&
                            "text-destructive opacity-100",
                        )}
                      >
                        {m.direction} · {m.status}
                        {m.sentAt
                          ? ` · ${new Date(m.sentAt).toLocaleString()}`
                          : ""}
                        {m.lastError ? ` · ${m.lastError}` : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={(e) => void onSend(e)}
                className="flex gap-2 border-t p-3"
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  disabled={sendMessage.isPending}
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={!draft.trim() || sendMessage.isPending}
                >
                  {sendMessage.isPending ? "Sending…" : "Send"}
                </Button>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
