"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useShops } from "@/hooks/use-shops";
import { useShopProductsInfinite } from "@/hooks/use-shop-products";

import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Badge } from "@/components/ui/badge";
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
  const [filter, setFilter] = useState("");
  const activeShopId = shopId || oauthShops[0]?.id || null;
  const productsQuery = useShopProductsInfinite(activeShopId);

  const products = useMemo(() => {
    const rows = productsQuery.data?.pages.flatMap((p) => p.products) ?? [];
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        (p.title ?? "").toLowerCase().includes(q),
    );
  }, [productsQuery.data?.pages, filter]);

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
        <SectionCard
          title="Catalog"
          description={`${products.length} product${products.length === 1 ? "" : "s"} loaded`}
          contentClassName="px-0"
        >
          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
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
            <Field>
              <FieldLabel htmlFor="product-filter">Search</FieldLabel>
              <Input
                id="product-filter"
                placeholder="Filter by title or id…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Field>
          </div>

          {productsQuery.isLoading ? (
            <div className="px-4">
              <Skeleton className="h-40 w-full" />
            </div>
          ) : productsQuery.isError ? (
            <p className="px-4 text-sm text-destructive" role="alert">
              {productsQuery.error instanceof Error
                ? productsQuery.error.message
                : "Failed to load products"}
            </p>
          ) : products.length === 0 ? (
            <p className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
              No active (ACTIVATE) products returned for this shop. Add
              products in TikTok Seller Center, then refresh.
            </p>
          ) : (
            <ul className="divide-y border-t">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title || p.id}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {p.id}
                    </p>
                  </div>
                  {p.status ? (
                    <Badge variant="secondary" className="shrink-0">
                      {p.status}
                    </Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          {productsQuery.hasNextPage ? (
            <div className="flex justify-center border-t px-4 pt-4">
              <Button
                variant="outline"
                disabled={productsQuery.isFetchingNextPage}
                onClick={() => void productsQuery.fetchNextPage()}
              >
                {productsQuery.isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          ) : null}
        </SectionCard>
      )}
    </div>
  );
}
