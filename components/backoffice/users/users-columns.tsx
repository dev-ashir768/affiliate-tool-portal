"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import type { User, UserStatus } from "@/types/users";

export type UserRow = User & Record<string, unknown>;

const columnHelper = createColumnHelper<DataTableFeatures, UserRow>();

function statusVariant(status: UserStatus) {
  if (status === "active") return "default" as const;
  if (status === "invited") return "secondary" as const;
  return "outline" as const;
}

export const usersColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  }),
  columnHelper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: (info) => {
      const status = info.getValue();
      return <Badge variant={statusVariant(status)}>{status}</Badge>;
    },
  }),
  columnHelper.accessor("shop", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shop" />
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]);
