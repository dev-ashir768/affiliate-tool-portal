"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { User, UserStatus } from "@/types/users";

const columnHelper = createColumnHelper<DataTableFeatures, User>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function statusBadgeClass(status: UserStatus) {
  if (status === "active") {
    return "border-transparent bg-primary text-primary-foreground";
  }
  if (status === "invited") {
    return "border-transparent bg-foreground text-background";
  }
  return "border-border bg-transparent text-muted-foreground";
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
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-2.5 py-0.5 font-medium capitalize",
            statusBadgeClass(status),
          )}
        >
          {status}
        </Badge>
      );
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
