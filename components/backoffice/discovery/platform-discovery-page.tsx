"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/data-table";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useCreateCrawlTerm,
  useCreatePlatformDiscovery,
  useCrawlTerms,
  useDeleteCrawlTerm,
  useDiscoveryCrawlStatus,
  useImportPlatformDiscovery,
  usePatchCrawlTerm,
  usePlanDiscoveryCrawl,
  usePlatformDiscovery,
  useRegisterCrawlScheduler,
  useReindexDiscoverySearch,
  useRefreshDiscoveryCrawlMetrics,
  useSeedCrawlTerms,
  useSyncTikTokDiscovery,
  useTikTokDiscoveryStatus,
} from "@/hooks/use-commerce";
import { platformDiscoveryColumns } from "./platform-discovery-columns";

const REGION_OPTIONS: SelectOption[] = [
  { value: "US", label: "US" },
  { value: "UK", label: "UK" },
];

const TERM_REGION_OPTIONS: SelectOption[] = [
  { value: "", label: "All regions" },
  { value: "US", label: "US only" },
  { value: "UK", label: "UK only" },
];

const IMPORT_PLACEHOLDER = `[
  { "handle": "creator_one", "region": "US", "followerCount": 50000 },
  { "handle": "creator_two", "region": "UK", "displayName": "Creator Two" }
]`;

export function PlatformDiscoveryPageContent() {
  const [search, setSearch] = useState("");
  const query = usePlatformDiscovery({ search: search || undefined });
  const tiktokStatus = useTikTokDiscoveryStatus();
  const crawlStatus = useDiscoveryCrawlStatus();
  const termsQuery = useCrawlTerms({ pageSize: 100 });
  const create = useCreatePlatformDiscovery();
  const importProfiles = useImportPlatformDiscovery();
  const syncTikTok = useSyncTikTokDiscovery();
  const planCrawl = usePlanDiscoveryCrawl();
  const refreshCrawlMetrics = useRefreshDiscoveryCrawlMetrics();
  const createTerm = useCreateCrawlTerm();
  const patchTerm = usePatchCrawlTerm();
  const deleteTerm = useDeleteCrawlTerm();
  const seedTerms = useSeedCrawlTerms();
  const registerScheduler = useRegisterCrawlScheduler();
  const reindexSearch = useReindexDiscoverySearch();
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [followers, setFollowers] = useState("");
  const [region, setRegion] = useState<"US" | "UK" | "">("");
  const [importJson, setImportJson] = useState("");
  const [syncKeyword, setSyncKeyword] = useState("");
  const [crawlOrgId, setCrawlOrgId] = useState("");
  const [crawlShopId, setCrawlShopId] = useState("");
  const [crawlMaxCells, setCrawlMaxCells] = useState("50");
  const [crawlRegion, setCrawlRegion] = useState<"US" | "UK" | "">("US");
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordRegion, setNewKeywordRegion] = useState<"US" | "UK" | "">(
    "",
  );

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

  async function onCrawlPlan() {
    if (!crawlOrgId.trim() || !crawlShopId.trim()) {
      toast.error("organizationId and shopId required");
      return;
    }
    try {
      const maxCells = Number(crawlMaxCells) || 50;
      const result = (await planCrawl.mutateAsync({
        organizationId: crawlOrgId.trim(),
        shopId: crawlShopId.trim(),
        region: crawlRegion || undefined,
        maxCells,
        maxPages: 10,
        skipDays: 7,
        sync: true,
      })) as {
        enqueued?: number;
        skippedFresh?: number;
        totalCells?: number;
        jobId?: string;
      };
      if (result.jobId) {
        toast.success(`Crawl plan queued (${result.jobId})`);
      } else {
        toast.success(
          `Enqueued ${result.enqueued ?? 0} cells (skipped fresh ${result.skippedFresh ?? 0} / ${result.totalCells ?? 0})`,
        );
      }
      void crawlStatus.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Crawl plan failed");
    }
  }

  async function onCrawlMetricsRefresh() {
    if (!crawlOrgId.trim() || !crawlShopId.trim()) {
      toast.error("organizationId and shopId required");
      return;
    }
    try {
      const result = (await refreshCrawlMetrics.mutateAsync({
        organizationId: crawlOrgId.trim(),
        shopId: crawlShopId.trim(),
        limit: 50,
        olderThanHours: 168,
      })) as { jobId?: string; refreshed?: number };
      if (result.jobId) {
        toast.success(`Metrics refresh queued (${result.jobId})`);
      } else {
        toast.success(`Refreshed ${result.refreshed ?? 0} profiles`);
      }
      void crawlStatus.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Refresh failed");
    }
  }

  async function onAddKeyword(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    try {
      await createTerm.mutateAsync({
        keyword: newKeyword.trim(),
        region: newKeywordRegion || null,
      });
      setNewKeyword("");
      toast.success("Keyword added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  const rows = query.data?.data ?? [];
  const tableState = useClientDataTable({
    data: rows,
    getSortValue: (p, id) => {
      if (id === "gmv") {
        return p.gmvCents ?? p.gmvAmount ?? p.gmvRange ?? "";
      }
      return (p as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;
  const cfg = tiktokStatus.data?.config;
  const queue = tiktokStatus.data?.queue;
  const crawl = crawlStatus.data;
  const terms = termsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Discovery index</h1>
        <p className="text-sm text-muted-foreground">
          Shared creator catalog for merchant /discover. Sync from TikTok Shop
          Affiliate Seller API, or grow the index with the crawl grid.
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Search engine & scheduler</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Meilisearch is optional (falls back to Postgres). Multi-region
              scheduler uses env shop IDs + cron on the worker.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={reindexSearch.isPending}
              onClick={() => {
                void reindexSearch
                  .mutateAsync()
                  .then((r) =>
                    toast.success(
                      r.engine === "disabled"
                        ? "Meili not configured"
                        : `Reindexed ${r.indexed} docs`,
                    ),
                  )
                  .catch((err) =>
                    toast.error(
                      err instanceof Error ? err.message : "Reindex failed",
                    ),
                  );
              }}
            >
              {reindexSearch.isPending ? "Reindexing…" : "Reindex Meili"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={registerScheduler.isPending}
              onClick={() => {
                void registerScheduler
                  .mutateAsync()
                  .then((r) => {
                    const result = r as {
                      enabled?: boolean;
                      registered?: string[];
                    };
                    toast.success(
                      result.enabled
                        ? `Scheduler registered: ${(result.registered ?? []).join(", ") || "none"}`
                        : "Scheduler disabled / not configured",
                    );
                    void crawlStatus.refetch();
                  })
                  .catch((err) =>
                    toast.error(
                      err instanceof Error ? err.message : "Register failed",
                    ),
                  );
              }}
            >
              {registerScheduler.isPending ? "Registering…" : "Refresh scheduler"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Meili:{" "}
          {crawl?.search?.configured
            ? crawl.search.reachable
              ? `reachable (${crawl.search.numberOfDocuments ?? "?"} docs)`
              : "configured but unreachable"
            : "disabled (Postgres only)"}
          {crawl?.scheduler
            ? ` · Scheduler: ${crawl.scheduler.enabled ? "on" : "off"} cron=${crawl.scheduler.cron} regions=${crawl.scheduler.regions.map((r) => r.region).join(",") || "none"}`
            : null}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Crawl keywords</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Editable grid terms. Empty DB auto-seeds from built-in list on
              first plan.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={seedTerms.isPending}
            onClick={() => {
              void seedTerms
                .mutateAsync()
                .then((r) =>
                  toast.success(
                    r.seeded
                      ? `Seeded ${r.seeded} (total ${r.total})`
                      : `Already seeded (${r.total})`,
                  ),
                )
                .catch((err) =>
                  toast.error(err instanceof Error ? err.message : "Seed failed"),
                );
            }}
          >
            {seedTerms.isPending ? "Seeding…" : "Seed defaults"}
          </Button>
        </div>
        <form
          onSubmit={(e) => void onAddKeyword(e)}
          className="flex flex-wrap gap-2"
        >
          <Input
            placeholder="keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="max-w-xs"
          />
          <AppReactSelect
            className="min-w-[10rem]"
            options={TERM_REGION_OPTIONS}
            value={stringSelectValue(TERM_REGION_OPTIONS, newKeywordRegion)}
            onChange={(opt) =>
              setNewKeywordRegion(
                (opt?.value as "US" | "UK" | undefined) ?? "",
              )
            }
            isSearchable={false}
            aria-label="Keyword region"
          />
          <Button type="submit" disabled={createTerm.isPending}>
            Add
          </Button>
        </form>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-background text-muted-foreground">
              <tr>
                <th className="py-1 pr-2 font-medium">Keyword</th>
                <th className="py-1 pr-2 font-medium">Region</th>
                <th className="py-1 pr-2 font-medium">On</th>
                <th className="py-1 font-medium" />
              </tr>
            </thead>
            <tbody>
              {terms.slice(0, 80).map((t) => (
                <tr key={t.id} className="border-t border-border/60">
                  <td className="py-1 pr-2">{t.keyword}</td>
                  <td className="py-1 pr-2">{t.region ?? "ALL"}</td>
                  <td className="py-1 pr-2">
                    <button
                      type="button"
                      className="underline-offset-2 hover:underline"
                      disabled={patchTerm.isPending}
                      onClick={() => {
                        void patchTerm
                          .mutateAsync({
                            id: t.id,
                            body: { enabled: !t.enabled },
                          })
                          .catch((err) =>
                            toast.error(
                              err instanceof Error ? err.message : "Failed",
                            ),
                          );
                      }}
                    >
                      {t.enabled ? "yes" : "no"}
                    </button>
                  </td>
                  <td className="py-1">
                    <button
                      type="button"
                      className="text-destructive underline-offset-2 hover:underline"
                      disabled={deleteTerm.isPending}
                      onClick={() => {
                        void deleteTerm
                          .mutateAsync(t.id)
                          .then(() => toast.success("Deleted"))
                          .catch((err) =>
                            toast.error(
                              err instanceof Error ? err.message : "Failed",
                            ),
                          );
                      }}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {termsQuery.isLoading ? (
            <p className="text-xs text-muted-foreground">Loading keywords…</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Index crawl (scale)</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Keyword × follower-band cells enqueue marketplace search with CRM
              propagate off. Use an OAuth-connected crawl shop.
            </p>
          </div>
          {crawl?.index ? (
            <div className="text-right text-xs text-muted-foreground">
              <p>
                Index:{" "}
                <span className="font-medium text-foreground">
                  {crawl.index.enabledProfiles.toLocaleString()}
                </span>{" "}
                · open_id {crawl.index.withOpenId.toLocaleString()} · gmvCents{" "}
                {crawl.index.withGmvCents.toLocaleString()}
              </p>
              <p>
                Seed keywords: {crawl.index.keywordSeedSize} · bands{" "}
                {crawl.index.followerBands.join(", ")}
              </p>
            </div>
          ) : null}
        </div>
        {crawl?.queue ? (
          <p className="text-xs text-muted-foreground">
            Queue {crawl.queue.name}: waiting {crawl.queue.counts.waiting ?? 0},
            active {crawl.queue.counts.active ?? 0}, failed{" "}
            {crawl.queue.counts.failed ?? 0}
          </p>
        ) : null}
        {crawl?.cells?.byStatus ? (
          <p className="text-xs text-muted-foreground">
            Cells:{" "}
            {Object.entries(crawl.cells.byStatus)
              .map(([k, v]) => `${k}=${v}`)
              .join(" · ") || "none yet"}
          </p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="organizationId"
            value={crawlOrgId}
            onChange={(e) => setCrawlOrgId(e.target.value)}
          />
          <Input
            placeholder="shopId (OAuth)"
            value={crawlShopId}
            onChange={(e) => setCrawlShopId(e.target.value)}
          />
          <AppReactSelect
            className="min-w-0"
            options={REGION_OPTIONS}
            value={stringSelectValue(REGION_OPTIONS, crawlRegion)}
            onChange={(opt) =>
              setCrawlRegion((opt?.value as "US" | "UK" | undefined) ?? "")
            }
            placeholder="Region"
            isSearchable={false}
            aria-label="Crawl region"
          />
          <Input
            placeholder="maxCells (default 50)"
            value={crawlMaxCells}
            onChange={(e) => setCrawlMaxCells(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={planCrawl.isPending}
              onClick={() => void onCrawlPlan()}
            >
              {planCrawl.isPending ? "Planning…" : "Run crawl plan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={refreshCrawlMetrics.isPending}
              onClick={() => void onCrawlMetricsRefresh()}
            >
              {refreshCrawlMetrics.isPending ? "Queuing…" : "Refresh stale"}
            </Button>
          </div>
        </div>
        {crawl?.cells?.recent?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 pr-2 font-medium">Cell</th>
                  <th className="py-1 pr-2 font-medium">Status</th>
                  <th className="py-1 pr-2 font-medium">+/-</th>
                  <th className="py-1 font-medium">Last run</th>
                </tr>
              </thead>
              <tbody>
                {crawl.cells.recent.slice(0, 8).map((c) => (
                  <tr key={c.cellKey} className="border-t border-border/60">
                    <td className="py-1 pr-2 font-mono text-[11px]">
                      {c.cellKey}
                    </td>
                    <td className="py-1 pr-2">{c.lastStatus ?? "—"}</td>
                    <td className="py-1 pr-2">
                      +{c.lastImported}/{c.lastUpdated}
                    </td>
                    <td className="py-1 text-muted-foreground">
                      {c.lastRunAt
                        ? new Date(c.lastRunAt).toLocaleString()
                        : "—"}
                      {c.lastError ? (
                        <span className="ml-2 text-destructive">
                          {c.lastError.slice(0, 60)}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">TikTok OpenAPI sync</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {cfg?.note ??
                "Prefer shop OAuth. Env token+cipher is ops fallback only."}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Status:{" "}
            <span className="font-medium text-foreground">
              {cfg?.appConfigured || cfg?.configured
                ? cfg?.envTokenConfigured
                  ? "App + env fallback"
                  : "App ready (use shop OAuth)"
                : "Not configured"}
            </span>
          </div>
        </div>
        {cfg && !(cfg.appConfigured || cfg.configured) ? (
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
            disabled={!cfg?.envTokenConfigured || syncTikTok.isPending}
            onClick={() => void onTikTokSync(false)}
          >
            {syncTikTok.isPending ? "Starting…" : "Queue sync (env)"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!cfg?.envTokenConfigured || syncTikTok.isPending}
            onClick={() => void onTikTokSync(true)}
          >
            Sync now (env)
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
        <AppReactSelect
          className="min-w-0"
          options={REGION_OPTIONS}
          value={stringSelectValue(REGION_OPTIONS, region)}
          onChange={(opt) =>
            setRegion((opt?.value as "US" | "UK" | undefined) ?? "")
          }
          placeholder="Region"
          isClearable
          isSearchable={false}
          aria-label="Region"
        />
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

      <DataTable
        tableId="platform-discovery"
        columns={platformDiscoveryColumns}
        data={tableState.data}
        totalCount={tableState.totalCount}
        pagination={tableState.pagination}
        onPaginationChange={tableState.onPaginationChange}
        sorting={tableState.sorting}
        onSortingChange={tableState.onSortingChange}
        search={search}
        onSearchChange={setSearch}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        getRowId={(row) => row.id}
        ariaLabel="Discovery index"
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
