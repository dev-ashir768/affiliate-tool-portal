"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";

export type PlatformAuditRow = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  createdAt: string;
  actor: { id: string; email: string; name: string } | null;
  meta: unknown;
};

const columnHelper = createColumnHelper<DataTableFeatures, PlatformAuditRow>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatMeta(meta: unknown): string {
  if (meta == null) return "";
  if (typeof meta !== "object") return String(meta);
  const entries = Object.entries(meta as Record<string, unknown>);
  if (entries.length === 0) return "";
  return entries
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
    .join(" · ");
}

export const auditColumns = columnHelper.columns([
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="When" />
    ),
    meta: { label: "When" },
    enableHiding: false,
    size: 180,
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
    size: 220,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("entityType", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
    meta: { label: "Entity" },
    size: 240,
    cell: (info) => {
      const row = info.row.original;
      return (
        <span className="inline-flex max-w-full items-center gap-1.5">
          <Badge variant="secondary" className="shrink-0">
            {info.getValue()}
          </Badge>
          {row.entityId ? (
            <span
              className="truncate font-mono text-xs text-muted-foreground"
              title={row.entityId}
            >
              {row.entityId}
            </span>
          ) : null}
        </span>
      );
    },
  }),
  columnHelper.accessor("actor", {
    id: "actor",
    header: "Actor",
    meta: { label: "Actor" },
    enableSorting: false,
    size: 240,
    cell: (info) => {
      const actor = info.getValue();
      if (!actor) {
        return <span className="text-muted-foreground">System</span>;
      }
      return (
        <div className="min-w-0" title={`${actor.name} <${actor.email}>`}>
          <p className="truncate font-medium">{actor.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {actor.email}
          </p>
        </div>
      );
    },
  }),
  columnHelper.accessor("meta", {
    id: "details",
    header: "Details",
    meta: { label: "Details" },
    enableSorting: false,
    size: 320,
    cell: (info) => {
      const text = formatMeta(info.getValue());
      return text ? (
        <span className="font-mono text-xs text-muted-foreground" title={text}>
          {text}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  }),
]);
