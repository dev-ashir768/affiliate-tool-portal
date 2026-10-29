"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useShops } from "@/hooks/use-shops";
import { useShopProductsInfinite } from "@/hooks/use-shop-products";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import { DataTable } from "@/components/data-table";
import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import type { ShopProductSummary } from "@/types/products";
import { createProductsColumns } from "./products-columns";
import { ProductDetailSheet } from "./product-detail-sheet";

export function ProductsPageContent() {
  const shopsQuery = useShops();
  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );
  const shopOptions: SelectOption[] = useMemo(
    () =>
      oauthShops.length === 0
        ? [{ value: "", label: "Authorize a shop first", isDisabled: true }]
        : oauthShops.map((s) => ({
            value: s.id,
            label: `${s.displayName || s.id} (${s.region})`,
          })),
    [oauthShops],
  );
  const [shopId, setShopId] = useState("");
  const [detailProduct, setDetailProduct] =
    useState<ShopProductSummary | null>(null);
  const activeShopId = shopId || oauthShops[0]?.id || null;
  const productsQuery = useShopProductsInfinite(activeShopId);

  const rows = useMemo(
    () => productsQuery.data?.pages.flatMap((p) => p.products) ?? [],
    [productsQuery.data?.pages],
  );

  const tableState = useClientDataTable({
    data: rows,
    getSearchText: (p) =>
      [
        p.id,
        p.title,
        p.primarySellerSku,
        p.status,
        p.auditStatus,
        p.listingQualityTier,
        ...(p.salesRegions ?? []),
        ...p.skus.map((s) => s.sellerSku),
      ]
        .filter(Boolean)
        .join(" "),
    getSortValue: (p, id) => {
      if (id === "price") {
        const n = Number.parseFloat(p.primaryPriceAmount ?? "");
        return Number.isFinite(n) ? n : null;
      }
      if (id === "title") return p.title ?? p.id;
      if (id === "regions") return (p.salesRegions ?? []).join(",");
      return (p as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });

  const columns = useMemo(
    () =>
      createProductsColumns({
        onOpenDetails: setDetailProduct,
      }),
    [],
  );

  if (shopsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Active TikTok Shop catalog (read-only). Use these products when creating affiliate invites and campaigns."
        actions={
          <Link
            href="/invites"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Create invite
          </Link>
        }
      />

      {oauthShops.length === 0 ? (
        <SectionCard
          title="No authorized shop"
          description="Connect and authorize a TikTok Shop to load its product catalog."
        >
          <Link href="/shops" className={buttonVariants({ size: "lg" })}>
            Go to Shops
          </Link>
        </SectionCard>
      ) : (
        <>
          <SectionCard
            title="Catalog"
            description={`${rows.length} product${rows.length === 1 ? "" : "s"} loaded${
              productsQuery.hasNextPage ? " · more available" : ""
            }`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Shop</FieldLabel>
                <AppReactSelect
                  options={shopOptions}
                  value={stringSelectValue(shopOptions, activeShopId ?? "")}
                  onChange={(opt) =>
                    setShopId(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable
                  aria-label="Shop"
                />
              </Field>
              {productsQuery.hasNextPage ? (
                <Field className="justify-end sm:items-end">
                  <FieldLabel className="sr-only">Load more</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={productsQuery.isFetchingNextPage}
                    onClick={() => void productsQuery.fetchNextPage()}
                  >
                    {productsQuery.isFetchingNextPage
                      ? "Loading…"
                      : "Load more from TikTok"}
                  </Button>
                </Field>
              ) : null}
            </div>
          </SectionCard>

          {productsQuery.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {productsQuery.error instanceof Error
                ? productsQuery.error.message
                : "Failed to load products"}
            </p>
          ) : null}

          <DataTable
            tableId="dashboard-products"
            columns={columns}
            data={tableState.data}
            totalCount={tableState.totalCount}
            pagination={tableState.pagination}
            onPaginationChange={tableState.onPaginationChange}
            sorting={tableState.sorting}
            onSortingChange={tableState.onSortingChange}
            search={tableState.search}
            onSearchChange={tableState.onSearchChange}
            isLoading={productsQuery.isLoading}
            isFetching={productsQuery.isFetching}
            isError={productsQuery.isError}
            onRetry={() => void productsQuery.refetch()}
            onRefresh={() => void productsQuery.refetch()}
            enableColumnOrdering
            pageSizeOptions={[10, 20, 50]}
            getRowId={(row) => row.id}
            ariaLabel="Shop products"
          />

          <ProductDetailSheet
            product={detailProduct}
            open={detailProduct != null}
            onOpenChange={(open) => {
              if (!open) setDetailProduct(null);
            }}
          />
        </>
      )}
    </div>
  );
}
