"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import type { DiscoveryProfile } from "@/types/commerce";

const columnHelper = createColumnHelper<DataTableFeatures, DiscoveryProfile>();

function formatGmv(p: DiscoveryProfile) {
  if (p.gmvRange?.trim()) return p.gmvRange.trim();
  if (p.gmvAmount) {
    return `${p.gmvAmount}${p.gmvCurrency ? ` ${p.gmvCurrency}` : ""}`;
  }
  return "—";
}

export const platformDiscoveryColumns = columnHelper.columns([
  columnHelper.accessor("handle", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Handle" />
    ),
    meta: { label: "Handle" },
    enableHiding: false,
    cell: (info) => (
      <span className="font-medium">@{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("region", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    meta: { label: "Region" },
    cell: (info) => info.getValue() ?? "—",
  }),
  columnHelper.accessor("followerCount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Followers" />
    ),
    meta: { label: "Followers" },
    cell: (info) => info.getValue()?.toLocaleString() ?? "—",
  }),
  columnHelper.display({
    id: "gmv",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GMV" />
    ),
    meta: { label: "GMV" },
    cell: (info) => formatGmv(info.row.original),
  }),
  columnHelper.accessor("source", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    meta: { label: "Source" },
    cell: (info) => (
      <span className="text-xs text-muted-foreground">{info.getValue()}</span>
    ),
  }),
]);
