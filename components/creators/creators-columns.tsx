"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import type { Creator, CreatorList, CreatorStage } from "@/types/creators";

const columnHelper = createColumnHelper<DataTableFeatures, Creator>();

function formatGmv(row: Creator) {
  if (row.gmvRange?.trim()) return row.gmvRange.trim();
  if (row.gmvAmount?.trim()) {
    return `${row.gmvAmount}${row.gmvCurrency ? ` ${row.gmvCurrency}` : ""}`.trim();
  }
  return "—";
}

export type CreatorsTableActions = {
  stageOptions: SelectOption[];
  listOptions: SelectOption[];
  onStageChange: (creatorId: string, stage: CreatorStage) => void;
  onAddToList: (creatorId: string, listId: string) => void;
  onRemove: (creatorId: string) => void;
  removePending?: boolean;
};

export function createCreatorsColumns(actions: CreatorsTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("handle", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Handle" />
      ),
      meta: { label: "Handle" },
      enableHiding: false,
      cell: (info) => {
        const c = info.row.original;
        return (
          <div>
            <div className="font-medium">@{c.handle}</div>
            {c.metricsSyncedAt ? (
              <div className="text-xs text-muted-foreground">
                synced {new Date(c.metricsSyncedAt).toLocaleDateString()}
              </div>
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
    columnHelper.accessor("avgCommissionRange", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comm." />
      ),
      meta: { label: "Commission" },
      cell: (info) => info.getValue()?.trim() || "—",
    }),
    columnHelper.accessor("contactEmail", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      meta: { label: "Email" },
      cell: (info) => (
        <span className="text-xs text-muted-foreground">
          {info.getValue() ?? "—"}
        </span>
      ),
    }),
    columnHelper.accessor("stage", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stage" />
      ),
      meta: { label: "Stage" },
      cell: (info) => {
        const c = info.row.original;
        return (
          <AppReactSelect
            size="sm"
            className="min-w-32"
            portalMenu
            isSearchable={false}
            options={actions.stageOptions}
            value={stringSelectValue(actions.stageOptions, c.stage)}
            onChange={(opt) => {
              if (!opt) return;
              actions.onStageChange(c.id, opt.value as CreatorStage);
            }}
            aria-label={`Stage for @${c.handle}`}
          />
        );
      },
    }),
    columnHelper.display({
      id: "list",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="List" />
      ),
      meta: { label: "List" },
      cell: (info) => {
        const c = info.row.original;
        if (actions.listOptions.length === 0) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <AppReactSelect
            size="sm"
            className="min-w-36"
            portalMenu
            isSearchable
            isClearable
            placeholder="Add to…"
            options={actions.listOptions}
            value={null}
            onChange={(opt) => {
              if (!opt) return;
              actions.onAddToList(c.id, String(opt.value));
            }}
            aria-label={`Add @${c.handle} to list`}
          />
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { label: "Actions" },
      enableHiding: false,
      cell: (info) => (
        <div className="text-right">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={actions.removePending}
            onClick={() => actions.onRemove(info.row.original.id)}
          >
            Remove
          </Button>
        </div>
      ),
    }),
  ]);
}

export function listsToOptions(lists: CreatorList[]): SelectOption[] {
  return lists.map((l) => ({
    value: l.id,
    label: `${l.name} · ${l.memberCount}`,
  }));
}
