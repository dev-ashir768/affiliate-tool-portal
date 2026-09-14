"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import type { User, UserStatus } from "@/types/users";

const columnHelper = createColumnHelper<DataTableFeatures, User>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

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
    meta: { label: "Name" },
    enableHiding: false,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: { label: "Email" },
  }),
  columnHelper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    meta: { label: "Role" },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { label: "Status" },
    cell: (info) => {
      const status = info.getValue();
      return <Badge variant={statusVariant(status)}>{status}</Badge>;
    },
  }),
  columnHelper.accessor("shop", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shop" />
    ),
    meta: { label: "Shop" },
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    meta: { label: "Created" },
    cell: (info) => createdAtFormatter.format(new Date(info.getValue())),
  }),
]);
