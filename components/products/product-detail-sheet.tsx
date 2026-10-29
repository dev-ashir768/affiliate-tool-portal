"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ShopProductSummary } from "@/types/products";

function formatPrice(
  amount: string | null | undefined,
  currency: string | null | undefined,
) {
  if (!amount?.trim()) return "—";
  return currency?.trim() ? `${currency} ${amount}` : amount;
}

function formatUnix(sec: number | null | undefined) {
  if (sec == null || !Number.isFinite(sec)) return "—";
  return new Date(sec * 1000).toLocaleString();
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 border-b border-border/60 py-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words">{value}</dd>
    </div>
  );
}

export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: {
  product: ShopProductSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {product ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle className="pr-8 text-left leading-snug">
                {product.title || product.id}
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {product.id}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4">
              <dl>
                <DetailRow
                  label="Status"
                  value={
                    product.status ? (
                      <Badge variant="secondary">{product.status}</Badge>
                    ) : (
                      "—"
                    )
                  }
                />
                <DetailRow
                  label="Audit"
                  value={
                    product.auditStatus ? (
                      <Badge variant="outline">{product.auditStatus}</Badge>
                    ) : (
                      "—"
                    )
                  }
                />
                <DetailRow
                  label="Quality"
                  value={product.listingQualityTier || "—"}
                />
                <DetailRow
                  label="Selling format"
                  value={product.sellingFormat || "—"}
                />
                <DetailRow
                  label="Not for sale"
                  value={
                    product.isNotForSale == null
                      ? "—"
                      : product.isNotForSale
                        ? "Yes"
                        : "No"
                  }
                />
                <DetailRow
                  label="Regions"
                  value={
                    product.salesRegions.length
                      ? product.salesRegions.join(", ")
                      : "—"
                  }
                />
                <DetailRow
                  label="Price"
                  value={formatPrice(
                    product.primaryPriceAmount,
                    product.primaryPriceCurrency,
                  )}
                />
                <DetailRow
                  label="Seller SKU"
                  value={
                    product.primarySellerSku ? (
                      <span className="font-mono text-xs">
                        {product.primarySellerSku}
                      </span>
                    ) : (
                      "—"
                    )
                  }
                />
                <DetailRow
                  label="Stock"
                  value={
                    product.totalInventory != null
                      ? product.totalInventory.toLocaleString()
                      : "—"
                  }
                />
                <DetailRow
                  label="Created"
                  value={formatUnix(product.createTime)}
                />
                <DetailRow
                  label="Updated"
                  value={formatUnix(product.updateTime)}
                />
              </dl>

              {product.skus.length > 0 ? (
                <div className="mt-4 pb-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    SKUs ({product.skus.length})
                  </p>
                  <ul className="divide-y rounded-md border">
                    {product.skus.map((sku) => (
                      <li key={sku.id} className="space-y-1 px-3 py-2 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs">
                            {sku.sellerSku || sku.id}
                          </span>
                          {sku.status ? (
                            <Badge
                              variant="secondary"
                              className="shrink-0 font-normal"
                            >
                              {sku.status}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span>
                            {formatPrice(sku.priceAmount, sku.priceCurrency)}
                          </span>
                          <span>
                            Qty:{" "}
                            {sku.inventoryQuantity != null
                              ? sku.inventoryQuantity.toLocaleString()
                              : "—"}
                          </span>
                          {sku.warehouseId ? (
                            <span className="truncate font-mono">
                              WH {sku.warehouseId}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
