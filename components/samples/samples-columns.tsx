"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SampleRequestRow } from "@/services/samples";

const columnHelper = createColumnHelper<DataTableFeatures, SampleRequestRow>();

export function createSamplesColumns(opts: {
  busyId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRefreshFulfillment: (id: string) => void;
}) {
  return columnHelper.columns([
    columnHelper.accessor("creatorHandle", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Creator" />
      ),
      meta: { label: "Creator" },
      cell: (info) => (
        <span className="font-medium">
          @
          {info.row.original.creatorHandle ??
            info.row.original.creatorUsername ??
            "—"}
        </span>
      ),
    }),
    columnHelper.accessor("productTitle", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      meta: { label: "Product" },
      cell: (info) => info.getValue() ?? "—",
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      meta: { label: "Status" },
      cell: (info) => <Badge variant="secondary">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor("shopName", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shop" />
      ),
      meta: { label: "Shop" },
      cell: (info) => {
        const row = info.row.original;
        return row.shopName
          ? `${row.shopName}${row.shopRegion ? ` (${row.shopRegion})` : ""}`
          : "—";
      },
    }),
    columnHelper.accessor("requestedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Requested" />
      ),
      meta: { label: "Requested" },
      cell: (info) => {
        const v = info.getValue();
        return v ? new Date(v).toLocaleDateString() : "—";
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      meta: { label: "Actions" },
      enableSorting: false,
      cell: ({ row }) => {
        const s = row.original;
        const busy = opts.busyId === s.id;
        const canReview = s.status === "PENDING" || s.status === "FAILED";
        return (
          <div className="flex flex-wrap gap-1">
            {canReview ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => opts.onApprove(s.id)}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => opts.onReject(s.id)}
                >
                  Reject
                </Button>
              </>
            ) : null}
            {s.externalApplicationId &&
            (s.status === "APPROVED" || s.status === "FULFILLING") ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => opts.onRefreshFulfillment(s.id)}
              >
                Fulfillment
              </Button>
            ) : null}
          </div>
        );
      },
    }),
  ]);
}
