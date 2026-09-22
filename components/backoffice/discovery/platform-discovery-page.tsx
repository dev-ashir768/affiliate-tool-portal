"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePlatformDiscovery,
  useImportPlatformDiscovery,
  usePlatformDiscovery,
  useSyncTikTokDiscovery,
  useTikTokDiscoveryStatus,
} from "@/hooks/use-commerce";

const IMPORT_PLACEHOLDER = `[
  { "handle": "creator_one", "region": "US", "followerCount": 50000 },
  { "handle": "creator_two", "region": "UK", "displayName": "Creator Two" }
]`;

export function PlatformDiscoveryPageContent() {
  const [search, setSearch] = useState("");
  const query = usePlatformDiscovery({ search: search || undefined });
  const tiktokStatus = useTikTokDiscoveryStatus();
  const create = useCreatePlatformDiscovery();
  const importProfiles = useImportPlatformDiscovery();
  const syncTikTok = useSyncTikTokDiscovery();
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [followers, setFollowers] = useState("");
  const [region, setRegion] = useState<"US" | "UK" | "">("");
  const [importJson, setImportJson] = useState("");
  const [syncKeyword, setSyncKeyword] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    try {
      await create.mutateAsync({
        handle: handle.trim(),
        displayName: displayName.trim() || null,
        region: region || null,
        followerCount: followers ? Number(followers) : null,
      });
      setHandle("");
      setDisplayName("");
      setFollowers("");
      setRegion("");
      toast.success("Added to discovery index");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function onImport(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJson) as unknown;
      const profiles = Array.isArray(parsed)
        ? parsed
        : (parsed as { profiles?: unknown }).profiles;
      if (!Array.isArray(profiles) || profiles.length === 0) {
        toast.error("Provide a JSON array of profiles");
        return;
      }
      const result = await importProfiles.mutateAsync(profiles);
      setImportJson("");
      toast.success(
        `Import done: ${result.created} upserted, ${result.skipped} skipped`,
      );
    } catch (err) {
      toast.error(
        err instanceof SyntaxError
          ? "Invalid JSON"
          : err instanceof Error
            ? err.message
            : "Import failed",
      );
    }
  }

  async function onTikTokSync(inline: boolean) {
    try {
      const result = (await syncTikTok.mutateAsync({
        maxPages: 3,
        pageSize: 20,
        keyword: syncKeyword.trim() || null,
        sync: inline,
      })) as {
        jobId?: string;
        imported?: number;
        skipped?: number;
        pages?: number;
        status?: string;
      };
      if (result.jobId) {
        toast.success(`TikTok sync queued (${result.jobId})`);
      } else {
        toast.success(
          `Synced ${result.imported ?? 0} creators (${result.pages ?? 0} pages)`,
        );
        void query.refetch();
      }
      void tiktokStatus.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;
  const rows = query.data?.data ?? [];
  const cfg = tiktokStatus.data?.config;
  const queue = tiktokStatus.data?.queue;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Discovery index</h1>
        <p className="text-sm text-muted-foreground">
          Shared creator catalog for merchant /discover. Sync from TikTok Shop
          Affiliate Seller API, or add/import manually.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">TikTok OpenAPI sync</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {cfg?.note ??
                "Requires app key/secret, seller access token, and shop_cipher."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Status:{" "}
            <span className="font-medium text-foreground">
              {cfg?.configured ? "Configured" : "Not configured"}
            </span>
          </div>
        </div>
        {cfg && !cfg.configured ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Missing: {cfg.missing.join(", ")}
          </p>
        ) : null}
        {queue ? (
          <p className="text-xs text-muted-foreground">
            Queue {queue.queue}: waiting {queue.counts.waiting ?? 0}, active{" "}
            {queue.counts.active ?? 0}, failed {queue.counts.failed ?? 0}
            {queue.lastRunAt
              ? ` · last ${new Date(queue.lastRunAt).toLocaleString()}`
              : ""}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Optional keyword"
            value={syncKeyword}
            onChange={(e) => setSyncKeyword(e.target.value)}
            className="max-w-xs"
          />
          <Button
            type="button"
            disabled={!cfg?.configured || syncTikTok.isPending}
            onClick={() => void onTikTokSync(false)}
          >
            {syncTikTok.isPending ? "Starting…" : "Queue sync"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!cfg?.configured || syncTikTok.isPending}
            onClick={() => void onTikTokSync(true)}
          >
            Sync now
          </Button>
        </div>
      </section>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          placeholder="@handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
        />
        <Input
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          placeholder="Followers"
          value={followers}
          onChange={(e) => setFollowers(e.target.value)}
        />
        <select
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={region}
          onChange={(e) => setRegion(e.target.value as "US" | "UK" | "")}
        >
          <option value="">Region</option>
          <option value="US">US</option>
          <option value="UK">UK</option>
        </select>
        <Button type="submit" disabled={create.isPending}>
          Add profile
        </Button>
      </form>

      <form
        onSubmit={(e) => void onImport(e)}
        className="space-y-2 rounded-xl border border-border p-4"
      >
        <h2 className="text-sm font-semibold">Bulk import (JSON)</h2>
        <Textarea
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder={IMPORT_PLACEHOLDER}
          className="min-h-28 font-mono text-xs"
        />
        <Button type="submit" disabled={importProfiles.isPending}>
          {importProfiles.isPending ? "Importing…" : "Import profiles"}
        </Button>
      </form>

      <Input
        placeholder="Filter…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Handle</th>
              <th className="px-3 py-2 font-medium">Region</th>
              <th className="px-3 py-2 font-medium">Followers</th>
              <th className="px-3 py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  No profiles yet. Sync from TikTok or add/import manually.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium">@{p.handle}</td>
                  <td className="px-3 py-2">{p.region ?? "—"}</td>
                  <td className="px-3 py-2">
                    {p.followerCount?.toLocaleString() ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {p.source}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
