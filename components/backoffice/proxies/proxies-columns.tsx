"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import { ProxyRowActions } from "@/components/backoffice/proxies/proxies-row-actions";
import type { PlatformProxy } from "@/types/platform";

const columnHelper = createColumnHelper<DataTableFeatures, PlatformProxy>();

export const proxiesColumns = columnHelper.columns([
  columnHelper.accessor("label", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    meta: { label: "Label" },
    enableHiding: false,
  }),
  columnHelper.display({
    id: "endpoint",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endpoint" />
    ),
    meta: { label: "Endpoint" },
    cell: (info) => {
      const proxy = info.row.original;
      return (
        <span className="font-mono text-xs">
          {proxy.protocol.toLowerCase()}://{proxy.host}:{proxy.port}
          {proxy.hasPassword ? " · auth" : ""}
        </span>
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
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { label: "Status" },
    cell: (info) => (
      <Badge variant="secondary">{info.getValue()}</Badge>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    meta: { label: "Actions" },
    enableHiding: false,
    enableSorting: false,
    cell: (info) => <ProxyRowActions proxy={info.row.original} />,
  }),
]);
