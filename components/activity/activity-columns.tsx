"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import type { OrgAuditLogEntry } from "@/types/orgs";

const columnHelper = createColumnHelper<DataTableFeatures, OrgAuditLogEntry>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const activityColumns = columnHelper.columns([
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="When" />
    ),
    meta: { label: "When" },
    enableHiding: false,
    cell: (info) => (
      <span className="text-muted-foreground tabular-nums">
        {createdAtFormatter.format(new Date(info.getValue()))}
      </span>
    ),
  }),
  columnHelper.accessor("action", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    meta: { label: "Action" },
    cell: (info) => (
      <span className="font-medium">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("entityType", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
    meta: { label: "Entity" },
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{info.getValue()}</Badge>
          {row.entityId ? (
            <span className="font-mono text-xs text-muted-foreground">
              {row.entityId}
            </span>
          ) : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("actor", {
    id: "actor",
    header: "Actor",
    meta: { label: "Actor" },
    enableSorting: false,
    cell: (info) => {
      const actor = info.getValue();
      if (!actor) {
        return <span className="text-muted-foreground">System</span>;
      }
      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{actor.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {actor.email}
          </p>
        </div>
      );
    },
  }),
]);
