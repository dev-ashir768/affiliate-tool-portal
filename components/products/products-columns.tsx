"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ShopProductSummary } from "@/types/products";

const columnHelper = createColumnHelper<DataTableFeatures, ShopProductSummary>();

function formatPrice(
  amount: string | null | undefined,
  currency: string | null | undefined,
) {
  if (!amount?.trim()) return "—";
  return currency?.trim() ? `${currency} ${amount}` : amount;
}

function qualityBadgeClass(tier: string | null) {
  const t = (tier ?? "").toUpperCase();
  if (t === "POOR") return "bg-muted text-muted-foreground";
  if (t === "FAIR") return "bg-muted text-foreground";
  if (t === "GOOD" || t === "EXCELLENT") {
    return "bg-secondary text-secondary-foreground";
  }
  return "bg-muted text-muted-foreground";
}

export type ProductsTableActions = {
  onOpenDetails: (product: ShopProductSummary) => void;
};

export function createProductsColumns(actions: ProductsTableActions) {
  return columnHelper.columns([
    columnHelper.display({
      id: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      meta: { label: "Product" },
      enableHiding: false,
      size: 280,
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            type="button"
            className="max-w-full text-left hover:opacity-90"
            onClick={() => actions.onOpenDetails(row)}
          >
            <div className="line-clamp-2 font-medium leading-snug">
              {row.title || row.id}
            </div>
            <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
              {row.id}
            </div>
          </button>
        );
      },
    }),
    columnHelper.accessor("primarySellerSku", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
      meta: { label: "SKU" },
      size: 120,
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue() || "—"}</span>
      ),
    }),
    columnHelper.display({
      id: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      meta: { label: "Price" },
      size: 110,
      cell: (info) => {
        const row = info.row.original;
        return formatPrice(row.primaryPriceAmount, row.primaryPriceCurrency);
      },
    }),
    columnHelper.accessor("totalInventory", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      meta: { label: "Stock" },
      size: 80,
      cell: (info) => {
        const v = info.getValue();
        return v != null ? v.toLocaleString() : "—";
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      meta: { label: "Status" },
      size: 100,
      cell: (info) => {
        const v = info.getValue();
        if (!v) return "—";
        return (
          <Badge variant="secondary" className="font-normal">
            {v}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("auditStatus", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Audit" />
      ),
      meta: { label: "Audit" },
      size: 110,
      cell: (info) => {
        const v = info.getValue();
        if (!v) return "—";
        return (
          <Badge variant="outline" className="font-normal">
            {v}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("listingQualityTier", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quality" />
      ),
      meta: { label: "Quality" },
      size: 100,
      cell: (info) => {
        const v = info.getValue();
        if (!v) return "—";
        return (
          <Badge
            variant="secondary"
            className={`font-normal ${qualityBadgeClass(v)}`}
          >
            {v}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "regions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Regions" />
      ),
      meta: { label: "Regions" },
      size: 100,
      cell: (info) => {
        const regions = info.row.original.salesRegions ?? [];
        if (!regions.length) return "—";
        return regions.join(", ");
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { label: "Actions" },
      enableHiding: false,
      size: 80,
      cell: (info) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => actions.onOpenDetails(info.row.original)}
        >
          Details
        </Button>
      ),
    }),
  ]);
}
