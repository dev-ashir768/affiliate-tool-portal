"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import {
  useDiscoverySearch,
  useOrgDiscoveryTikTokStatus,
  useRefreshOrgCrmCreatorMetrics,
  useSaveDiscoveryToCrm,
  useSyncOrgDiscoveryTikTok,
} from "@/hooks/use-commerce";
import { createDiscoverColumns } from "./discover-columns";
import { DiscoverProfileDetailSheet } from "./discover-profile-detail-sheet";
import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
import {
  TIKTOK_GMV_RANGE_OPTIONS,
  TIKTOK_UNITS_SOLD_RANGE_OPTIONS,
} from "@/lib/tiktok-marketplace-filters";
import type { DiscoveryProfile } from "@/types/commerce";

const REGION_OPTIONS: SelectOption[] = [
  { value: "", label: "All regions" },
  { value: "US", label: "US" },
  { value: "UK", label: "UK" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "followers", label: "Sort: followers" },
  { value: "units", label: "Sort: units sold" },
  { value: "gmv", label: "Sort: GMV" },
  { value: "updated", label: "Sort: recently updated" },
];

const GMV_BAND_OPTIONS: SelectOption[] = TIKTOK_GMV_RANGE_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

const UNITS_BAND_OPTIONS: SelectOption[] = TIKTOK_UNITS_SOLD_RANGE_OPTIONS.map(
  (o) => ({
    value: o.value,
    label: o.label,
  }),
);

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function DiscoverPageContent() {
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [minFollowersFilter, setMinFollowersFilter] = useState("");
  const [maxFollowersFilter, setMaxFollowersFilter] = useState("");
  const [gmvRange, setGmvRange] = useState("");
  const [unitsSoldRange, setUnitsSoldRange] = useState("");
  const [sortBy, setSortBy] = useState<"followers" | "units" | "updated" | "gmv">(
    "followers",
  );
  const [hasEmail, setHasEmail] = useState<"" | "true" | "false">("");
  const [nicheKeyword, setNicheKeyword] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [syncGmvRange, setSyncGmvRange] = useState("");
  const [syncUnitsSoldRange, setSyncUnitsSoldRange] = useState("");
  const [shopId, setShopId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [detailProfile, setDetailProfile] = useState<DiscoveryProfile | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search, 300);

  const filtersSignature = [
    debouncedSearch,
    region,
    minFollowersFilter,
    maxFollowersFilter,
    gmvRange,
    unitsSoldRange,
    hasEmail,
    sortBy,
  ].join("\0");
  const [appliedFiltersSignature, setAppliedFiltersSignature] =
    useState(filtersSignature);
  if (filtersSignature !== appliedFiltersSignature) {
    setAppliedFiltersSignature(filtersSignature);
    setPage(1);
  }

  const query = useDiscoverySearch({
    region: region || undefined,
    search: debouncedSearch.trim() || undefined,
    minFollowers: minFollowersFilter ? Number(minFollowersFilter) : undefined,
    maxFollowers: maxFollowersFilter ? Number(maxFollowersFilter) : undefined,
    gmvRange: gmvRange || undefined,
    unitsSoldRange: unitsSoldRange || undefined,
    hasEmail: hasEmail === "" ? undefined : hasEmail === "true",
    sortBy,
    page,
    pageSize,
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
  const totalCount = query.data?.meta.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  const narrowingFiltersActive = Boolean(
    debouncedSearch.trim() ||
      region ||
      minFollowersFilter ||
      maxFollowersFilter ||
      gmvRange ||
      unitsSoldRange ||
      hasEmail,
  );
  const showEmptyIndexPanel =
    query.isSuccess &&
    totalCount === 0 &&
    !narrowingFiltersActive &&
    oauthShops.length > 0;

  // Keep page in range when filters shrink the result set — do not clamp while
  // rendering (that desyncs controlled table state from React page state).
  if (page > pageCount) {
    setPage(pageCount);
  }

  const pagination: PaginationState = {
    pageIndex: Math.max(0, page - 1),
    pageSize,
  };

  const sorting: SortingState = useMemo(() => {
    const id =
      sortBy === "updated"
        ? "metricsSyncedAt"
        : sortBy === "followers"
          ? "followerCount"
          : sortBy;
    return [{ id, desc: true }];
  }, [sortBy]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    if (next.pageSize !== pageSize) {
      setPageSize(next.pageSize);
      setPage(1);
      return;
    }
    const nextPage = Math.max(1, next.pageIndex + 1);
    setPage(nextPage);
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const id = next[0]?.id;
    if (id === "units" || id === "gmv") {
      setSortBy(id);
      setPage(1);
    } else if (id === "followers" || id === "followerCount") {
      setSortBy("followers");
      setPage(1);
    } else if (id === "metricsSyncedAt" || id === "updated") {
      setSortBy("updated");
      setPage(1);
    }
  };

  function saveProfile(profileId: string) {
    setSavingId(profileId);
    void save
      .mutateAsync(profileId)
      .then(() => {
        toast.success("Saved to CRM");
        setDetailProfile((prev) =>
          prev?.id === profileId ? { ...prev, savedToCrm: true } : prev,
        );
      })
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed"),
      )
      .finally(() => setSavingId(null));
  }

  const columns = useMemo(
    () =>
      createDiscoverColumns({
        savingId,
        onOpenDetails: setDetailProfile,
        onSave: saveProfile,
      }),
    // saveProfile closes over save/savingId — recreate when those change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save, savingId],
  );

  const appReady = tiktok.data?.config?.appConfigured !== false;
  const busy = sync.isPending || refreshMetrics.isPending;

  async function onSync(
    inline: boolean,
    opts?: { keyword?: string | null; silentStartToast?: boolean },
  ) {
    if (!selectedShopId) {
      toast.error("Authorize a TikTok shop first (Shops page)");
      return;
    }
    if (opts?.silentStartToast) {
      toast.message("Starting first marketplace sync…");
    }
    try {
      const result = (await sync.mutateAsync({
        shopId: selectedShopId,
        maxPages: 10,
        pageSize: 20,
        keyword:
          opts && "keyword" in opts
            ? opts.keyword
            : nicheKeyword.trim() || null,
        minFollowers: minFollowers ? Number(minFollowers) : null,
        gmvRanges: syncGmvRange ? [syncGmvRange] : null,
        unitsSoldRanges: syncUnitsSoldRange ? [syncUnitsSoldRange] : null,
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

  // One-time first sync when shared index is empty and a shop is connected.
  useEffect(() => {
    if (!tiktok.isSuccess || !query.isSuccess) return;
    if (!appReady) return;
    if (oauthShops.length === 0 || !selectedShopId) return;
    if (totalCount !== 0 || narrowingFiltersActive) return;
    if (sync.isPending) return;

    const key = `discover:firstSyncQueued:${selectedShopId}`;
    try {
      if (window.localStorage.getItem(key)) return;
      window.localStorage.setItem(key, "1");
    } catch {
      return;
    }

    void onSync(false, { keyword: null, silentStartToast: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot when index settles empty
  }, [
    tiktok.isSuccess,
    query.isSuccess,
    appReady,
    oauthShops.length,
    selectedShopId,
    totalCount,
    narrowingFiltersActive,
    sync.isPending,
  ]);

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

  const emailOptions: SelectOption[] = [
    { value: "", label: "Email: any" },
    { value: "true", label: "Has email" },
    { value: "false", label: "No email" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Discover"
        description="Sync creators from your authorized TikTok Shop, then filter the shared index by followers, GMV band, units sold, and email."
      />

      <SectionCard
        title="Sync from your shop"
        description={
          appReady
            ? "Search TikTok Creator Marketplace through your authorized shop and add matches to the index."
            : "TikTok Shop integration isn't enabled yet. Please contact support."
        }
        actions={
          <Link
            href="/shops"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Manage shops
          </Link>
        }
      >
        {oauthShops.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No authorized shop yet.{" "}
            <Link href="/shops" className="font-medium text-primary underline">
              Authorize TikTok Shop
            </Link>{" "}
            first, then sync creators by niche.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <FormGrid columns={3} className="lg:grid-cols-5">
              <Field>
                <FieldLabel>Shop</FieldLabel>
                <AppReactSelect
                  options={shopOptions}
                  value={stringSelectValue(shopOptions, selectedShopId)}
                  onChange={(opt) =>
                    setShopId(opt?.value ? String(opt.value) : "")
                  }
                  placeholder="Shop"
                  isSearchable
                  aria-label="Shop"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sync-niche">Niche keyword</FieldLabel>
                <Input
                  id="sync-niche"
                  placeholder="e.g. skincare"
                  value={nicheKeyword}
                  onChange={(e) => setNicheKeyword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sync-min-followers">
                  Min followers
                </FieldLabel>
                <Input
                  id="sync-min-followers"
                  inputMode="numeric"
                  placeholder="Any"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>GMV (TikTok)</FieldLabel>
                <AppReactSelect
                  options={GMV_BAND_OPTIONS}
                  value={stringSelectValue(GMV_BAND_OPTIONS, syncGmvRange)}
                  onChange={(opt) =>
                    setSyncGmvRange(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={false}
                  aria-label="Sync GMV band"
                />
              </Field>
              <Field>
                <FieldLabel>Units sold (TikTok)</FieldLabel>
                <AppReactSelect
                  options={UNITS_BAND_OPTIONS}
                  value={stringSelectValue(
                    UNITS_BAND_OPTIONS,
                    syncUnitsSoldRange,
                  )}
                  onChange={(opt) =>
                    setSyncUnitsSoldRange(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={false}
                  aria-label="Sync units sold band"
                />
              </Field>
            </FormGrid>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!appReady || busy}
                onClick={() => void onRefreshCrmMetrics(false)}
              >
                Refresh CRM metrics
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!appReady || busy}
                onClick={() => void onSync(true)}
              >
                Sync now
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={!appReady || busy}
                onClick={() => void onSync(false)}
              >
                {sync.isPending ? "Starting…" : "Queue sync"}
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Filters"
        description={`${totalCount.toLocaleString()} matching creators · GMV / units bands match TikTok Shop Marketplace`}
      >
        <FormGrid columns={3} className="lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="discover-search">Search</FieldLabel>
            <Input
              id="discover-search"
              placeholder="Handle, name or bio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Region</FieldLabel>
            <AppReactSelect
              options={REGION_OPTIONS}
              value={stringSelectValue(REGION_OPTIONS, region)}
              onChange={(opt) =>
                setRegion(opt?.value ? String(opt.value) : "")
              }
              isSearchable={false}
              aria-label="Region filter"
            />
          </Field>
          <Field>
            <FieldLabel>GMV (TikTok)</FieldLabel>
            <AppReactSelect
              options={GMV_BAND_OPTIONS}
              value={stringSelectValue(GMV_BAND_OPTIONS, gmvRange)}
              onChange={(opt) =>
                setGmvRange(opt?.value ? String(opt.value) : "")
              }
              isSearchable={false}
              aria-label="GMV band"
            />
          </Field>
          <Field>
            <FieldLabel>Units sold (TikTok)</FieldLabel>
            <AppReactSelect
              options={UNITS_BAND_OPTIONS}
              value={stringSelectValue(UNITS_BAND_OPTIONS, unitsSoldRange)}
              onChange={(opt) =>
                setUnitsSoldRange(opt?.value ? String(opt.value) : "")
              }
              isSearchable={false}
              aria-label="Units sold band"
            />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <AppReactSelect
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
          </Field>
          <Field>
            <FieldLabel htmlFor="discover-min-followers">
              Min followers
            </FieldLabel>
            <Input
              id="discover-min-followers"
              inputMode="numeric"
              placeholder="Any"
              value={minFollowersFilter}
              onChange={(e) => setMinFollowersFilter(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="discover-max-followers">
              Max followers
            </FieldLabel>
            <Input
              id="discover-max-followers"
              inputMode="numeric"
              placeholder="Any"
              value={maxFollowersFilter}
              onChange={(e) => setMaxFollowersFilter(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Sort by</FieldLabel>
            <AppReactSelect
              options={SORT_OPTIONS}
              value={stringSelectValue(SORT_OPTIONS, sortBy)}
              onChange={(opt) => {
                const v = opt?.value ? String(opt.value) : "followers";
                if (
                  v === "units" ||
                  v === "updated" ||
                  v === "followers" ||
                  v === "gmv"
                ) {
                  setSortBy(v);
                }
              }}
              isSearchable={false}
              aria-label="Sort"
            />
          </Field>
        </FormGrid>
      </SectionCard>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load discovery"}
        </p>
      ) : null}

      {showEmptyIndexPanel ? (
        <SectionCard
          title="Your marketplace index is empty"
          description="Run Sync now to pull creators through your shop into the shared index."
          actions={
            <Button
              type="button"
              size="sm"
              disabled={!appReady || busy}
              onClick={() => void onSync(true)}
            >
              Sync now
            </Button>
          }
        >
          <p className="text-sm text-muted-foreground">
            Discover uses a shared Creator Marketplace index. After your first
            sync (or a platform crawl), creators will show up here for every
            org.
          </p>
        </SectionCard>
      ) : null}

      <DataTable
        tableId="dashboard-discover"
        columns={columns}
        data={rows}
        totalCount={totalCount}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        search={search}
        onSearchChange={(value) => {
          if (value === search) return;
          setSearch(value);
          setPage(1);
        }}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        enableColumnOrdering
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id}
        ariaLabel="Discover creators"
      />

      <DiscoverProfileDetailSheet
        profile={detailProfile}
        open={detailProfile != null}
        onOpenChange={(open) => {
          if (!open) setDetailProfile(null);
        }}
        onSave={saveProfile}
        saving={Boolean(detailProfile && savingId === detailProfile.id)}
      />
    </div>
  );
}
