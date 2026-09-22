"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AdminNavItem } from "@/types/platform";

const columnHelper = createColumnHelper<DataTableFeatures, AdminNavItem>();

export type NavItemDraft = {
  label: string;
  href: string;
  sortOrder: number;
};

export type NavigationAdminTableActions = {
  drafts: Record<string, NavItemDraft>;
  onDraftChange: (
    id: string,
    field: keyof NavItemDraft,
    value: string | number,
  ) => void;
  onSave: (item: AdminNavItem) => void;
  onToggleEnabled: (item: AdminNavItem) => void;
  savePending?: boolean;
};

export function createNavigationAdminColumns(
  actions: NavigationAdminTableActions,
) {
  return columnHelper.columns([
    columnHelper.accessor("key", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" />
      ),
      meta: { label: "Key" },
      enableHiding: false,
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "label",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      meta: { label: "Label" },
      cell: (info) => {
        const item = info.row.original;
        const draft = actions.drafts[item.id];
        return (
          <Input
            value={draft?.label ?? item.label}
            onChange={(e) =>
              actions.onDraftChange(item.id, "label", e.target.value)
            }
            className="h-8"
          />
        );
      },
    }),
    columnHelper.display({
      id: "href",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Href" />
      ),
      meta: { label: "Href" },
      cell: (info) => {
        const item = info.row.original;
        const draft = actions.drafts[item.id];
        return (
          <Input
            value={draft?.href ?? item.href}
            onChange={(e) =>
              actions.onDraftChange(item.id, "href", e.target.value)
            }
            className="h-8 font-mono text-xs"
          />
        );
      },
    }),
    columnHelper.display({
      id: "sortOrder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order" />
      ),
      meta: { label: "Order" },
      cell: (info) => {
        const item = info.row.original;
        const draft = actions.drafts[item.id];
        return (
          <Input
            type="number"
            value={draft?.sortOrder ?? item.sortOrder}
            onChange={(e) =>
              actions.onDraftChange(item.id, "sortOrder", Number(e.target.value))
            }
            className="h-8 w-20"
          />
        );
      },
    }),
    columnHelper.accessor("enabled", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      meta: { label: "Status" },
      cell: (info) => (
        <Badge variant={info.getValue() ? "secondary" : "outline"}>
          {info.getValue() ? "enabled" : "disabled"}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { label: "Actions" },
      enableHiding: false,
      enableSorting: false,
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={actions.savePending}
              onClick={() => actions.onSave(item)}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={actions.savePending}
              onClick={() => actions.onToggleEnabled(item)}
            >
              {item.enabled ? "Disable" : "Enable"}
            </Button>
          </div>
        );
      },
    }),
  ]);
}
