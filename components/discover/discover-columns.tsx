"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import type { DiscoveryProfile } from "@/types/commerce";

const columnHelper = createColumnHelper<DataTableFeatures, DiscoveryProfile>();

function formatGmv(row: DiscoveryProfile) {
  if (row.gmvRange?.trim()) return row.gmvRange.trim();
  if (row.gmvAmount?.trim()) {
    return `${row.gmvAmount}${row.gmvCurrency ? ` ${row.gmvCurrency}` : ""}`.trim();
  }
  return "—";
}

function formatGpm(row: DiscoveryProfile) {
  if (row.gpmRange?.trim()) return row.gpmRange.trim();
  if (row.gpmAmount) {
    return `${row.gpmAmount}${row.gpmCurrency ? ` ${row.gpmCurrency}` : ""}`;
  }
  return "—";
}

export type DiscoverTableActions = {
  onSave: (profileId: string) => void;
  savePending?: boolean;
};

export function createDiscoverColumns(actions: DiscoverTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("handle", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Handle" />
      ),
      meta: { label: "Handle" },
      enableHiding: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <div className="font-medium">@{row.handle}</div>
            {row.displayName ? (
              <div className="text-xs text-muted-foreground">
                {row.displayName}
              </div>
            ) : null}
          </div>
        );
      },
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
    columnHelper.accessor("unitsSold", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Units" />
      ),
      meta: { label: "Units" },
      cell: (info) => info.getValue()?.toLocaleString() ?? "—",
    }),
    columnHelper.display({
      id: "gpm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GPM" />
      ),
      meta: { label: "GPM" },
      cell: (info) => formatGpm(info.row.original),
    }),
    columnHelper.accessor("avgCommissionRange", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comm." />
      ),
      meta: { label: "Commission" },
      cell: (info) => info.getValue()?.trim() || "—",
    }),
    columnHelper.accessor("metricsSyncedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Synced" />
      ),
      meta: { label: "Synced" },
      cell: (info) => {
        const v = info.getValue();
        return (
          <span className="text-xs text-muted-foreground">
            {v ? new Date(v).toLocaleDateString() : "—"}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { label: "Actions" },
      enableHiding: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="text-right">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={actions.savePending}
              onClick={() => actions.onSave(row.id)}
            >
              Save
            </Button>
          </div>
        );
      },
    }),
  ]);
}
