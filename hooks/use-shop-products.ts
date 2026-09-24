"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchShopProducts } from "@/services/shops";

export function useShopProducts(shopId: string | null) {
  return useQuery({
    queryKey: ["shop-products", shopId],
    queryFn: ({ signal }) =>
      fetchShopProducts(shopId!, { pageSize: 50, signal }),
    enabled: Boolean(shopId),
    retry: false,
  });
}

/** Paginated catalog for the Products page. */
export function useShopProductsInfinite(shopId: string | null) {
  return useInfiniteQuery({
    queryKey: ["shop-products-infinite", shopId],
    queryFn: ({ pageParam, signal }) =>
      fetchShopProducts(shopId!, {
        pageSize: 50,
        pageToken: pageParam ?? null,
        signal,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextPageToken ?? undefined,
    enabled: Boolean(shopId),
    retry: false,
  });
}
