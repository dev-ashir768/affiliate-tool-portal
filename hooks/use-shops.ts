"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  connectShop,
  disconnectShop,
  fetchShops,
  verifyShop,
} from "@/services/shops";
import type { ConnectShopSchemaType } from "@/validations/shop.validations";

export function useShops() {
  return useQuery({
    queryKey: ["shops", "list"],
    queryFn: ({ signal }) => fetchShops(signal),
    staleTime: 15_000,
    retry: false,
    refetchInterval: (query) => {
      const shops = query.state.data?.shops ?? [];
      return shops.some((s) => s.status === "VERIFYING") ? 3000 : false;
    },
  });
}

export function useConnectShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ConnectShopSchemaType) => connectShop(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shops", "list"] });
    },
  });
}

export function useVerifyShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verifyShop(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shops", "list"] });
    },
  });
}

export function useDisconnectShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disconnectShop(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shops", "list"] });
    },
  });
}
