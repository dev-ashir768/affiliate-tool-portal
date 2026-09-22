"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import type { ShopOrderRow } from "@/types/commerce";

const columnHelper = createColumnHelper<DataTableFeatures, ShopOrderRow>();

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export const ordersColumns = columnHelper.columns([
  columnHelper.accessor("externalOrderId", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    meta: { label: "Order" },
    enableHiding: false,
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("creatorHandle", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    meta: { label: "Creator" },
    cell: (info) => {
      const handle = info.getValue();
      return handle ? `@${handle}` : "—";
    },
  }),
  columnHelper.accessor("gmvCents", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GMV" />
    ),
    meta: { label: "GMV" },
    cell: (info) =>
      formatMoney(info.getValue(), info.row.original.currency),
  }),
  columnHelper.accessor("commissionCents", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commission" />
    ),
    meta: { label: "Commission" },
    cell: (info) =>
      formatMoney(info.getValue(), info.row.original.currency),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { label: "Status" },
  }),
]);
