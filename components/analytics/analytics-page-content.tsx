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
import { SectionCard } from "@/components/layout/section-card";
import {
  CreatorGmvChart,
  FunnelChart,
  GmvByDayChart,
  OrderStatusDonut,
  Sparkline,
} from "./analytics-charts";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.length === 3 ? currency : "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** KPI card with optional sparkline */
function KpiCard({
  label,
  value,
  sub,
  spark,
  sparkColor,
}: {
  label: string;
  value: string;
  sub?: string;
  spark?: number[];
  sparkColor?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/[0.08]">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      {spark !== undefined ? (
        <div className="mt-1">
          <Sparkline data={spark} color={sparkColor} />
        </div>
      ) : null}
    </div>
  );
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
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

  const gmvByDay = data.charts?.gmvByDay ?? [];
  const shopGmvByCreator = data.shopGmvByCreator ?? [];
  const campaignsPerformance = data.campaignsPerformance ?? [];
  const recentOrders = data.recentOrders ?? [];

  // sparkline data: daily gmv values (last 14 days max) for mini charts
  const gmvSpark = gmvByDay.slice(-14).map((d) => d.gmvCents);

  const funnelData = [
    { name: "Creators", value: f.creators },
    { name: "Invited", value: f.contactedOrInvited },
    { name: "Outreach", value: f.outreachSent },
    { name: "Orders", value: f.orders },
  ];

  return (
    <div className="flex flex-col gap-6">
      {header}

      {/* ── KPI cards ────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Shop GMV"
          value={
            shop
              ? formatMoney(shop.gmvCents, shopPrimaryCurrency)
              : formatMoney(f.gmvCents)
          }
          sub={`${shop?.orders ?? f.orders} orders`}
          spark={gmvSpark}
          sparkColor="var(--chart-2)"
        />
        <KpiCard
          label="Commission"
          value={formatMoney(
            shop?.commissionCents ?? f.commissionCents,
            shopPrimaryCurrency,
          )}
          sub="Attributed to creators"
          spark={gmvSpark.map((v) => Math.round(v * 0.1))}
          sparkColor="var(--chart-1)"
        />
        <KpiCard
          label="Marketplace GMV"
          value={
            marketplace
              ? marketplace.multiCurrency
                ? `${marketplace.byCurrency.length} currencies`
                : formatMoney(
                    marketplace.parsedGmvCents,
                    marketPrimaryCurrency,
                  )
              : "—"
          }
          sub={`${marketplace?.creatorsWithMetrics ?? 0} creators synced`}
        />
        <KpiCard
          label="Outreach sent"
          value={String(f.outreachSent)}
          sub={`${f.contactedOrInvited} invited`}
        />
      </div>

      {/* ── GMV by day + Order status ────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Shop GMV by day"
          description="Paid and pending attributed orders in the selected range"
          className="lg:col-span-2"
        >
          <GmvByDayChart data={gmvByDay} />
        </SectionCard>

        <SectionCard title="Order status" description="Recent order breakdown">
          <OrderStatusDonut orders={recentOrders} />
        </SectionCard>
      </div>

      {/* ── Funnel + Creator GMV ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Affiliate funnel"
          description="Creators through outreach to attributed orders"
        >
          <FunnelChart data={funnelData} />
        </SectionCard>

        <SectionCard
          title="Shop GMV by creator"
          description="Top creators by attributed shop order GMV"
        >
          <CreatorGmvChart data={shopGmvByCreator} />
        </SectionCard>
      </div>

      {/* ── Marketplace GMV detail ───────────────────────────────── */}
      {marketplace && (marketplace.byCurrency.length > 0) ? (
        <SectionCard
          title="Marketplace GMV by currency"
          description="TikTok Creator Marketplace affiliate GMV snapshots — not shop sales."
        >
          <ul className="divide-y text-sm">
            {marketplace.byCurrency.map((b) => (
              <li
                key={b.currency}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="text-muted-foreground">{b.currency}</span>
                <span className="font-semibold tabular-nums">
                  {formatMoney(b.gmvCents, b.currency)}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({b.creators} creators)
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {marketplace.lastSyncedAt ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Last metrics sync{" "}
              {new Date(marketplace.lastSyncedAt).toLocaleString()}
            </p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
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
        </SectionCard>
      ) : null}

      {/* ── Top CRM creators table ───────────────────────────────── */}
      {topCreators.length > 0 ? (
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
      ) : null}

      {/* ── Campaign performance ─────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                    {c.invites} invites · {c.outreachSent} emails
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* ── Recent orders ──────────────────────────────────────── */}
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
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="font-semibold tabular-nums">
                      {formatMoney(o.gmvCents, o.currency ?? "USD")}
                    </span>
                    <span className="text-xs capitalize text-muted-foreground">
                      {o.status.toLowerCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
