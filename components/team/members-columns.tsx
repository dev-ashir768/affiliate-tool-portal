"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { OrgMember, OrgMemberStatus } from "@/types/orgs";

const columnHelper = createColumnHelper<DataTableFeatures, OrgMember>();

function statusBadgeClass(status: OrgMemberStatus) {
  if (status === "ACTIVE") {
    return "border-transparent bg-primary text-primary-foreground";
  }
  if (status === "INVITED") {
    return "border-transparent bg-foreground text-background";
  }
  return "border-border bg-transparent text-muted-foreground";
}

export const membersColumns = columnHelper.columns([
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
    cell: (info) => (
      <span className="capitalize">{info.getValue().toLowerCase()}</span>
    ),
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
          {status.toLowerCase()}
        </Badge>
      );
    },
  }),
]);
