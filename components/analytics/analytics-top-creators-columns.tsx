"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import type { AnalyticsTopMarketplaceCreator } from "@/types/commerce";

const columnHelper = createColumnHelper<
  DataTableFeatures,
  AnalyticsTopMarketplaceCreator
>();

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.length === 3 ? currency : "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatCreatorGmv(row: AnalyticsTopMarketplaceCreator) {
  if (row.gmvCents != null) {
    return formatMoney(row.gmvCents, row.gmvCurrency ?? "USD");
  }
  if (row.gmvRange?.trim()) return row.gmvRange.trim();
  if (row.gmvAmount?.trim()) {
    return `${row.gmvAmount}${row.gmvCurrency ? ` ${row.gmvCurrency}` : ""}`.trim();
  }
  return "—";
}

export const analyticsTopCreatorsColumns = columnHelper.columns([
  columnHelper.accessor("handle", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    meta: { label: "Creator" },
    enableHiding: false,
    cell: (info) => {
      const c = info.row.original;
      return (
        <div>
          <div className="font-medium">@{c.handle}</div>
          {c.displayName ? (
            <div className="text-xs text-muted-foreground">{c.displayName}</div>
          ) : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("followerCount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Followers" />
    ),
    meta: { label: "Followers" },
    cell: (info) => info.getValue()?.toLocaleString() ?? "—",
  }),
  columnHelper.display({
    id: "marketplaceGmv",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marketplace GMV" />
    ),
    meta: { label: "Marketplace GMV" },
    cell: (info) => formatCreatorGmv(info.row.original),
  }),
]);
