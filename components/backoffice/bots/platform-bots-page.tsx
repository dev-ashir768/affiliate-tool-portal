"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreatePlatformBots,
  useDeletePlatformBot,
  usePlatformBots,
  useSetPlatformBotEnabled,
} from "@/hooks/use-platform";
import type { PlatformBotRow, PlatformBotStatus } from "@/types/platform";
import { cn } from "cn";

const STATUS_STYLES: Record<PlatformBotStatus, string> = {
  AVAILABLE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  RESERVED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  ASSIGNED: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  DISABLED: "border-border bg-muted text-muted-foreground",
};

const STATUS_FILTERS: Array<{ value: PlatformBotStatus | ""; label: string }> = [
  { value: "", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "DISABLED", label: "Disabled" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmails(raw: string) {
  const tokens = raw
    .split(/[\s,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const unique = [...new Set(tokens)];
  return {
    valid: unique.filter((t) => EMAIL_RE.test(t)),
    invalid: unique.filter((t) => !EMAIL_RE.test(t)),
  };
}

function AddBotsCard() {
  const [raw, setRaw] = useState("");
  const create = useCreatePlatformBots();
  const { valid, invalid } = parseEmails(raw);

  async function submit() {
    if (valid.length === 0) return;
    try {
      const result = await create.mutateAsync(valid);
      if (result.created.length > 0) {
        toast.success(`Added ${result.created.length} bot(s)`);
      }
      if (result.skipped.length > 0) {
        toast.message(`Already in pool: ${result.skipped.join(", ")}`);
      }
      setRaw("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add bots");
    }
  }

  return (
    <SectionCard
      title="Add bot emails"
      description="One per line or comma-separated. Each address must deliver to the bot inbox (e.g. aliases of bots@yourdomain.com) and have its own TikTok account."
      footer={
        <Button
          type="button"
          disabled={valid.length === 0 || invalid.length > 0 || create.isPending}
          onClick={() => void submit()}
        >
          {create.isPending
            ? "Adding…"
            : valid.length === 0
              ? "Add bots"
              : `Add ${valid.length} bot${valid.length === 1 ? "" : "s"}`}
        </Button>
      }
    >
      <Textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={"bot1@dealhoper.com\nbot2@dealhoper.com"}
        rows={4}
        className="font-mono text-sm"
        aria-label="Bot emails"
      />
      {invalid.length > 0 ? (
        <p className="mt-2 text-xs text-destructive">
          Not valid email: {invalid.join(", ")}
        </p>
      ) : null}
    </SectionCard>
  );
}

function BotActions({ bot }: { bot: PlatformBotRow }) {
  const setEnabled = useSetPlatformBotEnabled();
  const remove = useDeletePlatformBot();
  const linked = bot.shop !== null;
  const busy = setEnabled.isPending || remove.isPending;

  async function toggle() {
    const enabled = bot.status === "DISABLED";
    try {
      await setEnabled.mutateAsync({ id: bot.id, enabled });
      toast.success(enabled ? "Bot enabled" : "Bot disabled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update bot");
    }
  }

  async function del() {
    if (!window.confirm(`Remove ${bot.email} from the bot pool?`)) return;
    try {
      await remove.mutateAsync(bot.id);
      toast.success("Bot removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove bot");
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busy || (linked && bot.status !== "DISABLED")}
        title={linked ? "Disconnect the shop first" : undefined}
        onClick={() => void toggle()}
      >
        {bot.status === "DISABLED" ? "Enable" : "Disable"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="text-destructive"
        disabled={busy || linked}
        title={linked ? "Disconnect the shop first" : undefined}
        onClick={() => void del()}
      >
        Remove
      </Button>
    </div>
  );
}

export function PlatformBotsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PlatformBotStatus | "">("");
  const query = usePlatformBots({
    search: search.trim() || undefined,
    status: status || undefined,
  });
  const counts = query.data?.counts;
  const bots = query.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Bots"
        description="Bot identities that merchants invite as TikTok Shop collaborators. A merchant's Connect shop reserves the oldest available bot."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["AVAILABLE", "RESERVED", "ASSIGNED", "DISABLED"] as const).map((s) => (
          <div
            key={s}
            className="flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/[0.08]"
          >
            <p className="text-xs capitalize text-muted-foreground">
              {s.toLowerCase()}
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">
              {counts ? counts[s] : "—"}
            </p>
          </div>
        ))}
      </div>

      {counts && counts.AVAILABLE === 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <span className="font-medium">No available bots.</span>{" "}
          <span className="text-muted-foreground">
            Merchants will see &quot;No bots available&quot; when they click
            Connect shop. Add bot emails below.
          </span>
        </div>
      ) : null}

      <SectionCard title="Before a bot can be assigned">
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
          <li>Create a TikTok account for the bot email (the address must deliver to the bot inbox).</li>
          <li>Add the email below.</li>
          <li>
            On a computer with the API repo and production env, run{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">
              npm run bot:login -- bot1@yourdomain.com US
            </code>
            , sign in as the bot in the browser that opens, then press Enter.
          </li>
          <li>
            With live verify enabled, only bots whose TikTok login shows{" "}
            <span className="font-medium text-foreground">Saved</span> are given to merchants.
            If a login expires, verify fails with a re-login message — run the command again.
          </li>
        </ol>
      </SectionCard>

      <AddBotsCard />

      <SectionCard
        title="Bot pool"
        contentClassName="px-0"
        actions={
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email…"
            className="h-8 w-48"
            aria-label="Search bots"
          />
        }
      >
        <div className="mb-3 flex flex-wrap gap-1.5 px-4">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.label}
              type="button"
              size="sm"
              variant={status === f.value ? "default" : "outline"}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {query.isLoading ? (
          <div className="flex flex-col gap-2 px-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : query.isError ? (
          <p className="px-4 text-sm text-destructive">
            {query.error instanceof Error ? query.error.message : "Failed to load bots"}
          </p>
        ) : bots.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No bots match.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>TikTok login</TableHead>
                <TableHead>Linked shop</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="pl-4 font-mono text-xs">
                    {bot.email}
                    {bot.email.endsWith("@example.com") ? (
                      <span className="ml-2 font-sans text-[10px] text-destructive">
                        placeholder
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium capitalize",
                        STATUS_STYLES[bot.status],
                      )}
                    >
                      {bot.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {bot.sessionCapturedAt ? (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        Saved {new Date(bot.sessionCapturedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400">
                        Missing
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {bot.shop ? (
                      <Link
                        href={`/backoffice/organizations/${bot.shop.organization.id}`}
                        className="hover:underline"
                      >
                        {bot.shop.organization.name}
                        <span className="ml-1 text-xs text-muted-foreground">
                          · {bot.shop.region} · {bot.shop.status.toLowerCase()}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-4">
                    <BotActions bot={bot} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
