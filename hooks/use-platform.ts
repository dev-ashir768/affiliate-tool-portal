"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminNavItem,
  createPlatformProxy,
  createPlatformStaff,
  fetchAdminNavigation,
  fetchBillingOverview,
  fetchPlatformCrawler,
  fetchPlatformCreators,
  createPlatformCreator,
  patchPlatformCreator,
  fetchPlatformOrganization,
  fetchPlatformOrganizations,
  fetchPlatformPlans,
  fetchPlatformProxies,
  fetchPlatformShops,
  fetchPlatformStaff,
  patchAdminNavItem,
  patchPlatformPlan,
  patchPlatformProxy,
  patchPlatformStaff,
  runPlatformCrawlerDryCheck,
} from "@/services/platform";
import type { PlatformListParams, PlatformRole } from "@/types/platform";
import type {
  CreateProxySchemaType,
  CreateStaffSchemaType,
  PatchPlatformPlanSchemaType,
  PatchProxySchemaType,
  PatchStaffSchemaType,
} from "@/validations/platform.validations";

export function usePlatformStaff(params: PlatformListParams) {
  return useQuery({
    queryKey: ["platform", "staff", params],
    queryFn: ({ signal }) => fetchPlatformStaff(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function useCreatePlatformStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateStaffSchemaType) => createPlatformStaff(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "staff"] });
    },
  });
}

export function usePatchPlatformStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchStaffSchemaType }) =>
      patchPlatformStaff(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "staff"] });
    },
  });
}

export function usePlatformOrganizations(params: PlatformListParams) {
  return useQuery({
    queryKey: ["platform", "organizations", params],
    queryFn: ({ signal }) => fetchPlatformOrganizations(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function usePlatformOrganization(id: string) {
  return useQuery({
    queryKey: ["platform", "organizations", id],
    queryFn: ({ signal }) => fetchPlatformOrganization(id, signal),
    enabled: Boolean(id),
    retry: false,
  });
}

export function usePlatformShops(params: PlatformListParams) {
  return useQuery({
    queryKey: ["platform", "shops", params],
    queryFn: ({ signal }) => fetchPlatformShops(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function useBillingOverview() {
  return useQuery({
    queryKey: ["platform", "billing", "overview"],
    queryFn: ({ signal }) => fetchBillingOverview(signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function usePlatformProxies(
  params: PlatformListParams = { page: 1, pageSize: 50 },
) {
  return useQuery({
    queryKey: ["platform", "proxies", params],
    queryFn: ({ signal }) => fetchPlatformProxies(params, signal),
    retry: false,
  });
}

export function useCreatePlatformProxy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProxySchemaType) => createPlatformProxy(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "proxies"] });
    },
  });
}

export function usePatchPlatformProxy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchProxySchemaType }) =>
      patchPlatformProxy(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "proxies"] });
    },
  });
}

export function usePlatformCrawler() {
  return useQuery({
    queryKey: ["platform", "crawler"],
    queryFn: ({ signal }) => fetchPlatformCrawler(signal),
    refetchInterval: (q) =>
      q.state.data?.status === "RUNNING" ? 2_000 : false,
    retry: false,
  });
}

export function usePlatformCreators(
  params: PlatformListParams & { organizationId?: string },
) {
  return useQuery({
    queryKey: ["platform", "creators", params],
    queryFn: ({ signal }) => fetchPlatformCreators(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function useCreatePlatformCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlatformCreator,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "creators"] });
    },
  });
}

export function usePatchPlatformCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof patchPlatformCreator>[1];
    }) => patchPlatformCreator(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "creators"] });
    },
  });
}

export function useRunPlatformCrawlerDryCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: runPlatformCrawlerDryCheck,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "crawler"] });
    },
  });
}

export function useAdminNavigation(area: "dashboard" | "backoffice") {
  return useQuery({
    queryKey: ["platform", "navigation", area],
    queryFn: ({ signal }) => fetchAdminNavigation(area, signal),
    retry: false,
  });
}

export function useCreateAdminNavItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminNavItem,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "navigation"] });
      void qc.invalidateQueries({ queryKey: ["navigation"] });
    },
  });
}

export function usePatchAdminNavItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<{
        label: string;
        href: string;
        icon: string;
        sortOrder: number;
        badge: string | null;
        enabled: boolean;
        allowedPlatformRoles: PlatformRole[];
      }>;
    }) => patchAdminNavItem(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "navigation"] });
      void qc.invalidateQueries({ queryKey: ["navigation"] });
    },
  });
}

export function usePlatformPlans() {
  return useQuery({
    queryKey: ["platform", "plans"],
    queryFn: ({ signal }) => fetchPlatformPlans(signal),
    retry: false,
  });
}

export function usePatchPlatformPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: PatchPlatformPlanSchemaType;
    }) => patchPlatformPlan(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "plans"] });
    },
  });
}
