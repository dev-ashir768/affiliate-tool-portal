"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  connectShop,
  disconnectShop,
  fetchOpenCollabCreatorsSyncStatus,
  fetchShopBotInbox,
  fetchShops,
  fetchTikTokOAuthStatus,
  startTikTokShopOAuth,
  syncOpenCollabCreators,
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
      const verifying = shops.some((s) => s.status === "VERIFYING");
      const syncing = shops.some(
        (s) =>
          s.openCollabCreatorsSync?.status === "QUEUED" ||
          s.openCollabCreatorsSync?.status === "RUNNING",
      );
      return verifying || syncing ? 3000 : false;
    },
  });
}

export function useTikTokOAuthStatus() {
  return useQuery({
    queryKey: ["shops", "tiktok-oauth-status"],
    queryFn: ({ signal }) => fetchTikTokOAuthStatus(signal),
    staleTime: 60_000,
    retry: false,
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

export function useStartTikTokOAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { region: "US" | "UK"; shopId?: string | null }) =>
      startTikTokShopOAuth(body),
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

export function useSyncOpenCollabCreators() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shopId: string) => syncOpenCollabCreators(shopId),
    onSuccess: (_data, shopId) => {
      void queryClient.invalidateQueries({ queryKey: ["shops", "list"] });
      void queryClient.invalidateQueries({
        queryKey: ["shops", "open-collab-creators-sync", shopId],
      });
    },
  });
}

export function useOpenCollabCreatorsSyncStatus(shopId: string | null) {
  return useQuery({
    queryKey: ["shops", "open-collab-creators-sync", shopId],
    queryFn: ({ signal }) => fetchOpenCollabCreatorsSyncStatus(shopId!, signal),
    enabled: Boolean(shopId),
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status?.status === "QUEUED" || status?.status === "RUNNING"
        ? 3000
        : false;
    },
  });
}

export function useShopBotInbox(shopId: string | null) {
  return useQuery({
    queryKey: ["shops", "bot-inbox", shopId],
    queryFn: ({ signal }) => fetchShopBotInbox(shopId!, signal),
    enabled: Boolean(shopId),
    refetchInterval: 10_000,
    retry: false,
  });
}
