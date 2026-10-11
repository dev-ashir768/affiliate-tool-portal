"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminResetTwoFactor,
  fetchTwoFactorStatus,
  regenerateBackupCodes,
  revokeTrustedDevice,
} from "@/services/two-factor";

const STATUS_KEY = ["auth", "2fa", "status"] as const;

export function useTwoFactorStatus() {
  return useQuery({
    queryKey: STATUS_KEY,
    queryFn: ({ signal }) => fetchTwoFactorStatus(signal),
    retry: false,
  });
}

export function useRegenerateBackupCodes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => regenerateBackupCodes(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: STATUS_KEY }),
  });
}

export function useRevokeTrustedDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeTrustedDevice(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STATUS_KEY }),
  });
}

export function useAdminResetTwoFactor() {
  return useMutation({
    mutationFn: (userId: string) => adminResetTwoFactor(userId),
  });
}
