"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useShops } from "@/hooks/use-shops";
import { useInviteProducts } from "@/hooks/use-invites";

export default function ProductsPage() {
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
  const activeShopId = shopId || oauthShops[0]?.id || null;
  const productsQuery = useInviteProducts(activeShopId);

  if (shopsQuery.isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Active catalog from your TikTok Shop (used when creating affiliate
          invites).
        </p>
      </div>

      <AppReactSelect
        className="max-w-sm"
        options={shopOptions}
        value={stringSelectValue(shopOptions, activeShopId ?? "")}
        onChange={(opt) => setShopId(opt?.value ? String(opt.value) : "")}
        isSearchable
        isDisabled={oauthShops.length === 0}
        aria-label="Shop"
      />

      {productsQuery.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : productsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {productsQuery.error instanceof Error
            ? productsQuery.error.message
            : "Failed to load products"}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {(productsQuery.data?.products ?? []).length === 0 ? (
            <li className="px-3 py-4 text-sm text-muted-foreground">
              No active products returned.
            </li>
          ) : (
            (productsQuery.data?.products ?? []).map((p) => (
              <li key={p.id} className="px-3 py-2 text-sm">
                <span className="font-medium">{p.title || p.id}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {p.id}
                  {p.status ? ` · ${p.status}` : ""}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
