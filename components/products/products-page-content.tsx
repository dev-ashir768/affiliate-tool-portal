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
import { cn } from "cn";

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
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Active TikTok Shop catalog (read-only). Use these products when
            creating affiliate invites and campaigns.
          </p>
        </div>
        <Link
          href="/invites"
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Create invite
        </Link>
      </div>

      {oauthShops.length === 0 ? (
        <div className="rounded-md border border-border px-4 py-6 text-sm">
          <p className="font-medium">No OAuth-connected shop</p>
          <p className="mt-1 text-muted-foreground">
            Connect and authorize a TikTok Shop to load its product catalog.
          </p>
          <Link
            href="/shops"
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Go to Shops
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <AppReactSelect
              className="min-w-[220px] max-w-sm flex-1"
              options={shopOptions}
              value={stringSelectValue(shopOptions, activeShopId ?? "")}
              onChange={(opt) =>
                setShopId(opt?.value ? String(opt.value) : "")
              }
              isSearchable
              aria-label="Shop"
            />
            <Input
              className="max-w-xs"
              placeholder="Filter by title or id…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter products"
            />
          </div>

          {productsQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : productsQuery.isError ? (
            <div className="rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive">
              {productsQuery.error instanceof Error
                ? productsQuery.error.message
                : "Failed to load products"}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-border rounded-md border border-border">
                {products.length === 0 ? (
                  <li className="px-3 py-6 text-sm text-muted-foreground">
                    No active (ACTIVATE) products returned for this shop. Add
                    products in TikTok Seller Center, then refresh.
                  </li>
                ) : (
                  products.map((p) => (
                    <li key={p.id} className="px-3 py-2.5 text-sm">
                      <span className="font-medium">{p.title || p.id}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {p.id}
                        {p.status ? ` · ${p.status}` : ""}
                      </span>
                    </li>
                  ))
                )}
              </ul>

              {productsQuery.hasNextPage ? (
                <Button
                  variant="outline"
                  className="self-start"
                  disabled={productsQuery.isFetchingNextPage}
                  onClick={() => void productsQuery.fetchNextPage()}
                >
                  {productsQuery.isFetchingNextPage
                    ? "Loading…"
                    : "Load more"}
                </Button>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}
