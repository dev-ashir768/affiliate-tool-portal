"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useDiscoverySearch,
  useOrgDiscoveryTikTokStatus,
  useRefreshOrgCrmCreatorMetrics,
  useSaveDiscoveryToCrm,
  useSyncOrgDiscoveryTikTok,
} from "@/hooks/use-commerce";
import { createDiscoverColumns } from "./discover-columns";

const REGION_OPTIONS: SelectOption[] = [
  { value: "", label: "All regions" },
  { value: "US", label: "US" },
  { value: "UK", label: "UK" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "followers", label: "Sort: followers" },
  { value: "units", label: "Sort: units sold" },
  { value: "updated", label: "Sort: recently updated" },
];

const GMV_BAND_OPTIONS: SelectOption[] = [
  { value: "", label: "Any GMV band" },
  { value: "150K", label: "GMV contains 150K" },
  { value: "50K", label: "GMV contains 50K" },
  { value: "10K", label: "GMV contains 10K" },
  { value: "1K", label: "GMV contains 1K" },
  { value: "1M", label: "GMV contains 1M" },
];

export function DiscoverPageContent() {
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [minFollowersFilter, setMinFollowersFilter] = useState("");
  const [maxFollowersFilter, setMaxFollowersFilter] = useState("");
  const [minUnitsSold, setMinUnitsSold] = useState("");
  const [gmvRangeContains, setGmvRangeContains] = useState("");
  const [sortBy, setSortBy] = useState<"followers" | "units" | "updated">(
    "followers",
  );
  const [hasEmail, setHasEmail] = useState<"" | "true" | "false">("");
  const [nicheKeyword, setNicheKeyword] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [shopId, setShopId] = useState("");

  const query = useDiscoverySearch({
    region: region || undefined,
    search: search.trim() || undefined,
    minFollowers: minFollowersFilter ? Number(minFollowersFilter) : undefined,
    maxFollowers: maxFollowersFilter ? Number(maxFollowersFilter) : undefined,
    minUnitsSold: minUnitsSold ? Number(minUnitsSold) : undefined,
    gmvRangeContains: gmvRangeContains || undefined,
    hasEmail: hasEmail === "" ? undefined : hasEmail === "true",
    sortBy,
    pageSize: 50,
  });
  const tiktok = useOrgDiscoveryTikTokStatus();
  const sync = useSyncOrgDiscoveryTikTok();
  const refreshMetrics = useRefreshOrgCrmCreatorMetrics();
  const save = useSaveDiscoveryToCrm();
  const oauthShops = useMemo(
    () => (tiktok.data?.shops ?? []).filter((s) => s.oauthConnected),
    [tiktok.data?.shops],
  );
  const shopOptions: SelectOption[] = useMemo(
    () =>
      oauthShops.map((s) => ({
        value: s.id,
        label: `${s.displayName ?? s.externalShopId ?? s.id} (${s.region})${
          !s.hasCreatorMarketplaceScope ? " · check scope" : ""
        }`,
      })),
    [oauthShops],
  );
  const selectedShopId = shopId || shopOptions[0]?.value || "";
  const rows = query.data?.data ?? [];
  const tableState = useClientDataTable({
    data: rows,
    getSearchText: (row) =>
      [row.handle, row.displayName, row.region, row.gmvRange, row.gmvAmount]
        .filter(Boolean)
        .join(" "),
    getSortValue: (row, id) => {
      if (id === "gmv") return row.gmvAmount ?? row.gmvRange ?? "";
      if (id === "gpm") return row.gpmAmount ?? row.gpmRange ?? "";
      return (row as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });
  const columns = useMemo(
    () =>
      createDiscoverColumns({
        savePending: save.isPending,
        onSave: (profileId) => {
          void save
            .mutateAsync(profileId)
            .then(() => toast.success("Saved to CRM"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Failed"),
            );
        },
      }),
    [save],
  );
  async function onSync(inline: boolean) {
    if (!selectedShopId) {
      toast.error("Authorize a TikTok shop first (Shops page)");
      return;
    }
    try {
      const result = (await sync.mutateAsync({
        shopId: selectedShopId,
        maxPages: 3,
        pageSize: 20,
        keyword: nicheKeyword.trim() || null,
        minFollowers: minFollowers ? Number(minFollowers) : null,
        propagateCrm: true,
        sync: inline,
      })) as {
        jobId?: string;
        imported?: number;
        updated?: number;
        crmPropagated?: number;
        pages?: number;
      };
      if (result.jobId) {
        toast.success(`Discovery sync queued (${result.jobId})`);
      } else {
        toast.success(
          `Imported ${result.imported ?? 0}, updated ${result.updated ?? 0}, CRM ${result.crmPropagated ?? 0} (${result.pages ?? 0} pages)`,
        );
        void query.refetch();
      }
      void tiktok.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    }
  }
  async function onRefreshCrmMetrics(inline: boolean) {
    if (!selectedShopId) {
      toast.error("Authorize a TikTok shop first (Shops page)");
      return;
    }
    try {
      const result = await refreshMetrics.mutateAsync({
        shopId: selectedShopId,
        limit: 50,
        sync: inline,
      });
      if ("jobId" in result) {
        toast.success(`CRM metrics refresh queued (${result.jobId})`);
      } else {
        toast.success(
          `Refreshed ${result.refreshed}, skipped ${result.skipped}, failed ${result.failed}`,
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Refresh failed");
    }
  }
  if (query.isLoading) return <Skeleton className="h-48 w-full" />;
  const appReady = tiktok.data?.config?.appConfigured !== false;
  const busy = sync.isPending || refreshMetrics.isPending;
  const emailOptions: SelectOption[] = [
    { value: "", label: "Email: any" },
    { value: "true", label: "Has email" },
    { value: "false", label: "No email" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Sync creators from your authorized TikTok Shop, then filter the shared
          index by followers, GMV band, units sold, and email.
        </p>
      </div>
      <section className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Sync from your shop</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {tiktok.data?.config?.note ??
                "Uses your shop OAuth token + Creator Marketplace search."}
            </p>
          </div>
          <Link
            href="/shops"
            className={buttonVariants({
              variant: "link",
              className: "h-auto p-0 text-xs",
            })}
          >
            Manage shops
          </Link>
        </div>
        {oauthShops.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No OAuth-connected shop yet.{" "}
            <Link href="/shops" className="underline">
              Authorize TikTok Shop
            </Link>{" "}
            first, then sync creators by niche.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AppReactSelect
              className="min-w-56"
              options={shopOptions}
              value={stringSelectValue(shopOptions, selectedShopId)}
              onChange={(opt) =>
                setShopId(opt?.value ? String(opt.value) : "")
              }
              placeholder="Shop"
              isSearchable
              aria-label="Shop"
            />
            <Input
              placeholder="Niche keyword (e.g. skincare)"
              value={nicheKeyword}
              onChange={(e) => setNicheKeyword(e.target.value)}
              className="max-w-xs"
            />
            <Input
              placeholder="Min followers"
              inputMode="numeric"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
              className="w-32"
            />
            <Button
              type="button"
              disabled={!appReady || busy}
              onClick={() => void onSync(false)}
            >
              {sync.isPending ? "Starting…" : "Queue sync"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!appReady || busy}
              onClick={() => void onSync(true)}
            >
              Sync now
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={!appReady || busy}
              onClick={() => void onRefreshCrmMetrics(false)}
            >
              Refresh CRM metrics
            </Button>
          </div>
        )}
      </section>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search handle / name / bio"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <AppReactSelect
          className="min-w-40"
          options={REGION_OPTIONS}
          value={stringSelectValue(REGION_OPTIONS, region)}
          onChange={(opt) => setRegion(opt?.value ? String(opt.value) : "")}
          isSearchable={false}
          aria-label="Region filter"
        />
        <Input
          placeholder="Min followers"
          inputMode="numeric"
          value={minFollowersFilter}
          onChange={(e) => setMinFollowersFilter(e.target.value)}
          className="w-28"
        />
        <Input
          placeholder="Max followers"
          inputMode="numeric"
          value={maxFollowersFilter}
          onChange={(e) => setMaxFollowersFilter(e.target.value)}
          className="w-28"
        />
        <Input
          placeholder="Min units sold"
          inputMode="numeric"
          value={minUnitsSold}
          onChange={(e) => setMinUnitsSold(e.target.value)}
          className="w-32"
        />
        <AppReactSelect
          className="min-w-44"
          options={GMV_BAND_OPTIONS}
          value={stringSelectValue(GMV_BAND_OPTIONS, gmvRangeContains)}
          onChange={(opt) =>
            setGmvRangeContains(opt?.value ? String(opt.value) : "")
          }
          isSearchable={false}
          aria-label="GMV band"
        />
        <AppReactSelect
          className="min-w-36"
          options={emailOptions}
          value={stringSelectValue(emailOptions, hasEmail)}
          onChange={(opt) =>
            setHasEmail(
              opt?.value === "true" || opt?.value === "false"
                ? opt.value
                : "",
            )
          }
          isSearchable={false}
          aria-label="Email filter"
        />
        <AppReactSelect
          className="min-w-44"
          options={SORT_OPTIONS}
          value={stringSelectValue(SORT_OPTIONS, sortBy)}
          onChange={(opt) => {
            const v = opt?.value ? String(opt.value) : "followers";
            if (v === "units" || v === "updated" || v === "followers") {
              setSortBy(v);
            }
          }}
          isSearchable={false}
          aria-label="Sort"
        />
        <span className="text-xs text-muted-foreground">
          {query.data?.meta.total ?? 0} matches
        </span>
      </div>
      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load discovery"}
        </p>
      ) : null}
      <DataTable
        tableId="dashboard-discover"
        columns={columns}
        data={tableState.data}
        totalCount={query.data?.meta.total ?? tableState.totalCount}
        pagination={tableState.pagination}
        onPaginationChange={tableState.onPaginationChange}
        sorting={tableState.sorting}
        onSortingChange={tableState.onSortingChange}
        search={tableState.search}
        onSearchChange={tableState.onSearchChange}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        enableColumnOrdering
        pageSizeOptions={[10, 20, 50]}
        getRowId={(row) => row.id}
        ariaLabel="Discover creators"
      />
    </div>
  );
}
