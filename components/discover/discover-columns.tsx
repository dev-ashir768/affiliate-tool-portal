"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
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

function formatGender(row: DiscoveryProfile) {
  if (!row.majorGender) return "—";
  const pct =
    row.majorGenderPct != null
      ? ` ${Math.round(row.majorGenderPct / 100)}%`
      : "";
  return `${row.majorGender}${pct}`;
}

export type DiscoverTableActions = {
  onSave: (profileId: string) => void;
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
      size: 260,
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3">
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
    columnHelper.accessor("creatorLevel", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
      meta: { label: "Creator level" },
      cell: (info) => info.getValue() ?? "—",
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
      id: "videoGmv",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Video GMV" />
      ),
      meta: { label: "Video GMV" },
      cell: (info) => {
        const row = info.row.original;
        return formatMoney(row.videoGmvAmount, row.gmvCurrency);
      },
    }),
    columnHelper.display({
      id: "liveGmv",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Live GMV" />
      ),
      meta: { label: "Live GMV" },
      cell: (info) => {
        const row = info.row.original;
        return formatMoney(row.liveGmvAmount, row.gmvCurrency);
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
    columnHelper.display({
      id: "gpm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GPM" />
      ),
      meta: { label: "GPM" },
      cell: (info) => {
        const row = info.row.original;
        return formatMoney(row.gpmAmount, row.gpmCurrency, row.gpmRange);
      },
    }),
    columnHelper.accessor("avgCommissionRange", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comm." />
      ),
      meta: { label: "Commission" },
      cell: (info) => info.getValue()?.trim() || "—",
    }),
    columnHelper.accessor("avgEcVideoViewCount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg video views" />
      ),
      meta: { label: "Avg EC video views" },
      cell: (info) => info.getValue()?.toLocaleString() ?? "—",
    }),
    columnHelper.accessor("avgEcLiveUv", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg live UV" />
      ),
      meta: { label: "Avg EC live UV" },
      cell: (info) => info.getValue()?.toLocaleString() ?? "—",
    }),
    columnHelper.display({
      id: "audience",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Audience" />
      ),
      meta: { label: "Audience" },
      size: 180,
      cell: (info) => {
        const row = info.row.original;
        const ages = (row.ageRanges ?? [])
          .map((a) => a.replace(/^AGE_RANGE_/, "").replace(/_/g, "-"))
          .join(", ");
        return (
          <div className="text-xs">
            <div>{formatGender(row)}</div>
            {ages ? (
              <div className="text-muted-foreground">{ages}</div>
            ) : null}
          </div>
        );
      },
    }),
    columnHelper.accessor("categories", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categories" />
      ),
      meta: { label: "Categories" },
      size: 160,
      cell: (info) => {
        const cats = info.getValue() ?? [];
        if (!cats.length) return "—";
        return (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            {cats.join(", ")}
          </span>
        );
      },
    }),
    columnHelper.accessor("contactEmail", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      meta: { label: "Email" },
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
        const saving = actions.savingId === row.id;
        const saved = Boolean(row.savedToCrm);
        return (
          <div className="text-right">
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
