"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DiscoveryProfile } from "@/types/commerce";

const columnHelper = createColumnHelper<DataTableFeatures, DiscoveryProfile>();

function formatMoney(
  amount: string | null | undefined,
  currency: string | null | undefined,
  range?: string | null,
) {
  if (range?.trim()) return range.trim();
  if (amount?.trim()) {
    return `${amount}${currency ? ` ${currency}` : ""}`.trim();
  }
  return "—";
}

function formatUnits(row: DiscoveryProfile) {
  if (row.unitsSoldRange?.trim()) return row.unitsSoldRange.trim();
  if (row.unitsSold != null) return row.unitsSold.toLocaleString();
  return "—";
}

export type DiscoverTableActions = {
  onSave: (profileId: string) => void;
  onOpenDetails: (profile: DiscoveryProfile) => void;
  savingId?: string | null;
};

export function createDiscoverColumns(actions: DiscoverTableActions) {
  return columnHelper.columns([
    columnHelper.display({
      id: "creator",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Creator" />
      ),
      meta: { label: "Creator" },
      enableHiding: false,
      size: 240,
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            type="button"
            className="flex max-w-full items-center gap-3 text-left hover:opacity-90"
            onClick={() => actions.onOpenDetails(row)}
          >
            {row.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.avatarUrl}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="size-9 shrink-0 rounded-full bg-muted" />
            )}
            <div className="min-w-0">
              <div className="truncate font-medium">@{row.handle}</div>
              {row.displayName ? (
                <div className="truncate text-xs text-muted-foreground">
                  {row.displayName}
                </div>
              ) : null}
            </div>
          </button>
        );
      },
    }),
    columnHelper.accessor("region", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region" />
      ),
      meta: { label: "Region" },
      size: 80,
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
      cell: (info) => {
        const row = info.row.original;
        return formatMoney(row.gmvAmount, row.gmvCurrency, row.gmvRange);
      },
    }),
    columnHelper.display({
      id: "units",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Units" />
      ),
      meta: { label: "Units sold" },
      cell: (info) => formatUnits(info.row.original),
    }),
    columnHelper.accessor("categories", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categories" />
      ),
      meta: { label: "Categories" },
      size: 220,
      cell: (info) => {
        const cats = info.getValue() ?? [];
        if (!cats.length) return "—";
        const shown = cats.slice(0, 3);
        const extra = cats.length - shown.length;
        return (
          <div className="flex max-w-[14rem] flex-wrap gap-1">
            {shown.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {cat}
              </Badge>
            ))}
            {extra > 0 ? (
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                +{extra}
              </Badge>
            ) : null}
          </div>
        );
      },
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
      size: 160,
      cell: (info) => {
        const row = info.row.original;
        const saving = actions.savingId === row.id;
        const saved = Boolean(row.savedToCrm);
        return (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => actions.onOpenDetails(row)}
            >
              Details
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={saving || saved}
              onClick={() => {
                if (!saved) actions.onSave(row.id);
              }}
            >
              {saving ? "Saving…" : saved ? "Saved" : "Save"}
            </Button>
          </div>
        );
      },
    }),
  ]);
}
