"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import type { PlatformCreatorRow } from "@/types/platform";

const columnHelper = createColumnHelper<DataTableFeatures, PlatformCreatorRow>();

export type PlatformCreatorsTableActions = {
  stageOptions: SelectOption[];
  onStageChange: (creatorId: string, stage: string) => void;
};

export function createPlatformCreatorsColumns(
  actions: PlatformCreatorsTableActions,
) {
  return columnHelper.columns([
    columnHelper.display({
      id: "organization",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Org" />
      ),
      meta: { label: "Org" },
      cell: (info) => info.row.original.organization.name,
    }),
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-md">
              {c.stage}
            </Badge>
            <AppReactSelect
              size="sm"
              className="min-w-32"
              portalMenu
              isSearchable={false}
              options={actions.stageOptions}
              value={stringSelectValue(actions.stageOptions, c.stage)}
              onChange={(opt) => {
                if (!opt) return;
                actions.onStageChange(c.id, String(opt.value));
              }}
              aria-label={`Stage for @${c.handle}`}
            />
          </div>
        );
      },
    }),
  ]);
}
