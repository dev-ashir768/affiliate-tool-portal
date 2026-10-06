"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DateRangePicker,
  rangeFromDays,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import { DataTable } from "@/components/data-table";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import { useAnalyticsOverview } from "@/hooks/use-commerce";
import { analyticsTopCreatorsColumns } from "./analytics-top-creators-columns";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { SectionCard } from "@/components/layout/section-card";
function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.length === 3 ? currency : "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function AnalyticsPageContent() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    rangeFromDays(30),
  );
  const analyticsParams = useMemo(
    () => ({
      from: dateRange.from || undefined,
      to: dateRange.to || undefined,
    }),
    [dateRange.from, dateRange.to],
  );
  const query = useAnalyticsOverview(analyticsParams);
  const topCreators = query.data?.topMarketplaceCreators ?? [];
  const topCreatorsTable = useClientDataTable({
    data: topCreators,
    getSearchText: (c) =>
      [c.handle, c.displayName].filter(Boolean).join(" "),
    getSortValue: (c, id) => {
      if (id === "marketplaceGmv") {
        return c.gmvCents ?? c.gmvAmount ?? c.gmvRange ?? "";
      }
      return (c as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
    initialPageSize: 10,
  });

  const header = (
    <PageHeader
      title="Analytics"
      description="Funnel plus a clear split: shop order GMV vs creator marketplace GMV snapshots."
      actions={
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          disabled={query.isFetching}
        />
      }
    />
  );

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <SectionCard title="Unable to load analytics">
          <p className="text-sm text-destructive" role="alert">
            {query.error instanceof Error
              ? query.error.message
              : "Request failed"}
          </p>
        </SectionCard>
      </div>
    );
  }

  const data = query.data!;
  const f = data.funnel;
  const shop = data.gmv?.shop;
  const marketplace = data.gmv?.marketplace;
  const shopPrimaryCurrency = shop?.byCurrency[0]?.currency ?? "USD";
  const marketPrimaryCurrency = marketplace?.byCurrency[0]?.currency ?? "USD";

  const funnelCards = [
    { label: "Creators", value: String(f.creators) },
    { label: "Invited / active", value: String(f.contactedOrInvited) },
    { label: "Outreach sent", value: String(f.outreachSent) },
    { label: "Orders", value: String(f.orders) },
    {
      label: "Commission",
      value: formatMoney(f.commissionCents, shopPrimaryCurrency),
    },
  ];

  const shopGmvByCreator = data.shopGmvByCreator ?? [];
  const campaignsPerformance = data.campaignsPerformance ?? [];
  const recentOrders = data.recentOrders ?? [];

  return (
    <div className="flex flex-col gap-6">
      {header}

      <div className="grid gap-4 lg:grid-cols-2">
        <StatCard
          label={shop?.label ?? "Shop attributed GMV"}
          value={
            shop
              ? formatMoney(shop.gmvCents, shopPrimaryCurrency)
              : formatMoney(f.gmvCents)
          }
          hint={shop?.description ?? "Orders attributed to your TikTok Shop."}
        >
          <p>
            {shop?.orders ?? f.orders} orders · commission{" "}
            {formatMoney(
              shop?.commissionCents ?? f.commissionCents,
              shopPrimaryCurrency,
            )}
          </p>
          {(shop?.byCurrency.length ?? 0) > 1 ? (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {shop!.byCurrency.map((b) => (
                <li key={b.currency}>
                  {b.currency}: {formatMoney(b.gmvCents, b.currency)} (
                  {b.orders} orders)
                </li>
              ))}
            </ul>
          ) : null}
        </StatCard>

        <StatCard
          label={marketplace?.label ?? "Creator marketplace GMV"}
          value={
            marketplace
              ? marketplace.multiCurrency
                ? `${marketplace.byCurrency.length} currencies`
                : formatMoney(marketplace.parsedGmvCents, marketPrimaryCurrency)
              : "—"
          }
          hint={
            marketplace?.description ??
            "TikTok Creator Marketplace affiliate GMV snapshots — not shop sales."
          }
        >
          <p>
            {marketplace?.creatorsWithParsableGmv ?? 0} with amount ·{" "}
            {marketplace?.creatorsWithRangeOnly ?? 0} range-only ·{" "}
            {marketplace?.creatorsWithMetrics ?? 0} synced
          </p>
          {(marketplace?.byCurrency.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {marketplace!.byCurrency.map((b) => (
                <li key={b.currency}>
                  {b.currency}: {formatMoney(b.gmvCents, b.currency)} (
                  {b.creators} creators)
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              No marketplace amounts yet.{" "}
              <Link
                href="/discover"
                className={buttonVariants({
                  variant: "link",
                  className: "h-auto p-0 text-xs",
                })}
              >
                Sync / refresh metrics
              </Link>
            </p>
          )}
          {marketplace?.lastSyncedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Last metrics sync{" "}
              {new Date(marketplace.lastSyncedAt).toLocaleString()}
            </p>
          ) : null}
        </StatCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {funnelCards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {topCreators.length === 0 ? (
        <SectionCard
          title="Top CRM creators by marketplace GMV"
          description="No marketplace GMV on CRM creators yet."
        />
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">
            Top CRM creators by marketplace GMV
          </h2>
          <DataTable
            tableId="analytics-top-creators"
            columns={analyticsTopCreatorsColumns}
            data={topCreatorsTable.data}
            totalCount={topCreatorsTable.totalCount}
            pagination={topCreatorsTable.pagination}
            onPaginationChange={topCreatorsTable.onPaginationChange}
            sorting={topCreatorsTable.sorting}
            onSortingChange={topCreatorsTable.onSortingChange}
            search={topCreatorsTable.search}
            onSearchChange={topCreatorsTable.onSearchChange}
            getRowId={(row) => row.id}
            ariaLabel="Top CRM creators by marketplace GMV"
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Shop GMV by attributed creator"
          contentClassName="px-0"
        >
          {shopGmvByCreator.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">
              No shop orders linked to creators yet. Sync affiliate orders or
              attribute manually.
            </p>
          ) : (
            <ul className="divide-y text-sm">
              {shopGmvByCreator.map((c) => (
                <li
                  key={c.creatorId}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      @{c.handle ?? "unknown"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.displayName ? `${c.displayName} · ` : ""}
                      {c.orders} orders
                    </p>
                  </div>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatMoney(c.gmvCents, shopPrimaryCurrency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Campaign performance" contentClassName="px-0">
          {campaignsPerformance.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">
              No campaigns yet.
            </p>
          ) : (
            <ul className="divide-y text-sm">
              {campaignsPerformance.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.status}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {c.invites} invites · {c.outreachSent} emails sent
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent shop orders" contentClassName="px-0">
        {recentOrders.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="divide-y text-sm">
            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">
                    {o.externalOrderId}
                  </p>
                  {o.creatorHandle ? (
                    <p className="text-xs text-muted-foreground">
                      @{o.creatorHandle}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatMoney(o.gmvCents, o.currency ?? "USD")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
