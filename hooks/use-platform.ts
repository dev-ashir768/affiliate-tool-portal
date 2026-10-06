"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminNavItem,
  createPlatformStaff,
  fetchAdminNavigation,
  fetchBillingOverview,
  fetchPlatformCreators,
  createPlatformCreator,
  patchPlatformCreator,
  fetchPlatformOrganization,
  fetchPlatformOrganizations,
  grantPlatformOrganizationAccess,
  revokePlatformOrganizationAccess,
  fetchPlatformPlans,
  fetchPlatformShops,
  fetchPlatformBots,
  createPlatformBots,
  setPlatformBotEnabled,
  deletePlatformBot,
  fetchPlatformStaff,
  patchAdminNavItem,
  patchPlatformPlan,
  patchPlatformStaff,
} from "@/services/platform";
import type { PlatformListParams, PlatformRole } from "@/types/platform";
import type {
  CreateStaffSchemaType,
  GrantPlatformAccessSchemaType,
  PatchPlatformPlanSchemaType,
  PatchStaffSchemaType,
  RevokePlatformAccessSchemaType,
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

export function useGrantPlatformOrganizationAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: GrantPlatformAccessSchemaType;
    }) => grantPlatformOrganizationAccess(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["platform", "organizations", id] });
      void qc.invalidateQueries({ queryKey: ["platform", "organizations"] });
    },
  });
}

export function useRevokePlatformOrganizationAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: RevokePlatformAccessSchemaType;
    }) => revokePlatformOrganizationAccess(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["platform", "organizations", id] });
      void qc.invalidateQueries({ queryKey: ["platform", "organizations"] });
    },
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

export function usePlatformBots(params: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ["platform", "bots", params],
    queryFn: ({ signal }) => fetchPlatformBots(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}

export function useCreatePlatformBots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPlatformBots,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "bots"] });
    },
  });
}

export function useSetPlatformBotEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      setPlatformBotEnabled(id, enabled),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "bots"] });
    },
  });
}

export function useDeletePlatformBot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePlatformBot,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["platform", "bots"] });
    },
  });
}
