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

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  if (query.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {query.error instanceof Error
          ? query.error.message
          : "Unable to load analytics"}
      </p>
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Funnel plus a clear split: shop order GMV vs creator marketplace GMV
            snapshots.
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          disabled={query.isFetching}
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">GMV sources</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-border px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {shop?.label ?? "Shop attributed GMV"}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {shop
                ? formatMoney(shop.gmvCents, shopPrimaryCurrency)
                : formatMoney(f.gmvCents)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {shop?.description ??
                "Orders attributed to your TikTok Shop."}
            </p>
            <p className="mt-3 text-sm">
              {shop?.orders ?? f.orders} orders · commission{" "}
              {formatMoney(
                shop?.commissionCents ?? f.commissionCents,
                shopPrimaryCurrency,
              )}
            </p>
            {(shop?.byCurrency.length ?? 0) > 1 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {shop!.byCurrency.map((b) => (
                  <li key={b.currency}>
                    {b.currency}: {formatMoney(b.gmvCents, b.currency)} (
                    {b.orders} orders)
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="rounded-xl border border-border px-4 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {marketplace?.label ?? "Creator marketplace GMV"}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {marketplace
                ? marketplace.multiCurrency
                  ? `${marketplace.byCurrency.length} currencies`
                  : formatMoney(
                      marketplace.parsedGmvCents,
                      marketPrimaryCurrency,
                    )
                : "—"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {marketplace?.description ??
                "TikTok Creator Marketplace affiliate GMV snapshots — not shop sales."}
            </p>
            <p className="mt-3 text-sm">
              {marketplace?.creatorsWithParsableGmv ?? 0} with amount ·{" "}
              {marketplace?.creatorsWithRangeOnly ?? 0} range-only ·{" "}
              {marketplace?.creatorsWithMetrics ?? 0} synced
            </p>
            {(marketplace?.byCurrency.length ?? 0) > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {marketplace!.byCurrency.map((b) => (
                  <li key={b.currency}>
                    {b.currency}: {formatMoney(b.gmvCents, b.currency)} (
                    {b.creators} creators)
                  </li>
                ))}
              </ul>
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
            {marketplace?.lastSyncedAt ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Last metrics sync{" "}
                {new Date(marketplace.lastSyncedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Funnel</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {funnelCards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">
          Top CRM creators by marketplace GMV
        </h2>
        {topCreators.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No marketplace GMV on CRM creators yet.
          </p>
        ) : (
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
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">
          Shop GMV by attributed creator
        </h2>
        {(data.shopGmvByCreator ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No shop orders linked to creators yet. Sync affiliate orders or
            attribute manually.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.shopGmvByCreator!.map((c) => (
              <li
                key={c.creatorId}
                className="flex justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <span className="font-medium">@{c.handle ?? "unknown"}</span>
                  {c.displayName ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {c.displayName}
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {c.orders} orders
                  </span>
                </div>
                <span>{formatMoney(c.gmvCents, shopPrimaryCurrency)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Campaign performance</h2>
        {(data.campaignsPerformance ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No campaigns yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.campaignsPerformance!.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.invites} invites · {c.outreachSent} emails sent
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Recent shop orders</h2>
        <ul className="space-y-2 text-sm">
          {(data.recentOrders ?? []).length === 0 ? (
            <li className="text-muted-foreground">No orders yet.</li>
          ) : (
            data.recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex justify-between gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <span className="font-mono text-xs">{o.externalOrderId}</span>
                  {o.creatorHandle ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      @{o.creatorHandle}
                    </span>
                  ) : null}
                </div>
                <span>
                  {formatMoney(o.gmvCents, o.currency ?? "USD")}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
