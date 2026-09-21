"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  createPlatformDiscovery,
  fetchAnalyticsOverview,
  fetchOrders,
  fetchPlatformDiscovery,
  importPlatformDiscovery,
  saveDiscoveryToCrm,
  searchDiscovery,
} from "@/services/commerce";

export function useDiscoverySearch(params: {
  search?: string;
  region?: string;
  minFollowers?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["discovery", params],
    queryFn: ({ signal }) =>
      searchDiscovery(
        { page: 1, pageSize: 30, ...params },
        signal,
      ),
    retry: false,
  });
}

export function useSaveDiscoveryToCrm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveDiscoveryToCrm,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: ({ signal }) => fetchOrders(signal),
    retry: false,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["orders"] });
      void qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: ({ signal }) => fetchAnalyticsOverview(signal),
    retry: false,
  });
}

export function usePlatformDiscovery(params: { search?: string } = {}) {
  return useQuery({
    queryKey: ["platform", "discovery", params],
    queryFn: ({ signal }) =>
      fetchPlatformDiscovery({ page: 1, pageSize: 50, ...params }, signal),
    retry: false,
  });
}

export function useCreatePlatformDiscovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlatformDiscovery,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "discovery"] });
      void qc.invalidateQueries({ queryKey: ["discovery"] });
    },
  });
}

export function useImportPlatformDiscovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importPlatformDiscovery,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "discovery"] });
      void qc.invalidateQueries({ queryKey: ["discovery"] });
    },
  });
}
