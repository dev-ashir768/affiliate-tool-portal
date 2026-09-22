"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCrawlTerm,
  createOrder,
  createPlatformDiscovery,
  deleteCrawlTerm,
  fetchAnalyticsOverview,
  fetchCrawlTerms,
  fetchDiscoveryCrawlStatus,
  fetchOrders,
  fetchOrgDiscoveryTikTokStatus,
  fetchPlatformDiscovery,
  fetchTikTokDiscoveryStatus,
  importPlatformDiscovery,
  patchCrawlTerm,
  planDiscoveryCrawl,
  refreshDiscoveryCrawlMetrics,
  registerCrawlScheduler,
  reindexDiscoverySearch,
  saveDiscoveryToCrm,
  searchDiscovery,
  seedCrawlTerms,
  refreshOrgCrmCreatorMetrics,
  syncAffiliateOrders,
  syncOrgDiscoveryFromTikTok,
  syncTikTokDiscovery,
} from "@/services/commerce";

export function useDiscoverySearch(params: {
  search?: string;
  region?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minUnitsSold?: number;
  gmvRangeContains?: string;
  hasEmail?: boolean;
  sortBy?: "followers" | "units" | "updated" | "gmv";
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["discovery", params],
    queryFn: ({ signal }) =>
      searchDiscovery({ page: 1, pageSize: 30, ...params }, signal),
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

export function useSyncAffiliateOrders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncAffiliateOrders,
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

export function useTikTokDiscoveryStatus() {
  return useQuery({
    queryKey: ["platform", "discovery", "tiktok", "status"],
    queryFn: ({ signal }) => fetchTikTokDiscoveryStatus(signal),
    retry: false,
  });
}

export function useSyncTikTokDiscovery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncTikTokDiscovery,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "discovery"] });
      void qc.invalidateQueries({ queryKey: ["discovery"] });
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "tiktok", "status"],
      });
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function useDiscoveryCrawlStatus() {
  return useQuery({
    queryKey: ["platform", "discovery", "crawl"],
    queryFn: ({ signal }) => fetchDiscoveryCrawlStatus(signal),
    refetchInterval: (q) => {
      const active = q.state.data?.queue?.counts?.active ?? 0;
      const waiting = q.state.data?.queue?.counts?.waiting ?? 0;
      return active > 0 || waiting > 0 ? 3_000 : false;
    },
    retry: false,
  });
}

export function usePlanDiscoveryCrawl() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: planDiscoveryCrawl,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
      void qc.invalidateQueries({ queryKey: ["platform", "discovery"] });
    },
  });
}

export function useRefreshDiscoveryCrawlMetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshDiscoveryCrawlMetrics,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
      void qc.invalidateQueries({ queryKey: ["platform", "discovery"] });
    },
  });
}

export function useCrawlTerms(params: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  return useQuery({
    queryKey: ["platform", "discovery", "crawl", "terms", params],
    queryFn: ({ signal }) => fetchCrawlTerms(params, signal),
    retry: false,
  });
}

export function useCreateCrawlTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCrawlTerm,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl", "terms"],
      });
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function usePatchCrawlTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof patchCrawlTerm>[1];
    }) => patchCrawlTerm(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl", "terms"],
      });
    },
  });
}

export function useDeleteCrawlTerm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCrawlTerm,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl", "terms"],
      });
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function useSeedCrawlTerms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: seedCrawlTerms,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl", "terms"],
      });
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function useRegisterCrawlScheduler() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerCrawlScheduler,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function useReindexDiscoverySearch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reindexDiscoverySearch,
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["platform", "discovery", "crawl"],
      });
    },
  });
}

export function useOrgDiscoveryTikTokStatus() {
  return useQuery({
    queryKey: ["discovery", "tiktok", "status"],
    queryFn: ({ signal }) => fetchOrgDiscoveryTikTokStatus(signal),
    retry: false,
  });
}

export function useSyncOrgDiscoveryTikTok() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncOrgDiscoveryFromTikTok,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["discovery"] });
      void qc.invalidateQueries({
        queryKey: ["discovery", "tiktok", "status"],
      });
      void qc.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}

export function useRefreshOrgCrmCreatorMetrics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshOrgCrmCreatorMetrics,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["creators"] });
      void qc.invalidateQueries({ queryKey: ["discovery"] });
    },
  });
}
