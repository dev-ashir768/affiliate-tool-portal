"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createManualSample,
  fetchSamples,
  refreshSampleFulfillment,
  reviewSample,
  syncSamples,
} from "@/services/samples";

export function useSamples(params: { status?: string; shopId?: string } = {}) {
  return useQuery({
    queryKey: ["samples", params],
    queryFn: ({ signal }) => fetchSamples(params, signal),
    retry: false,
  });
}

export function useSyncSamples() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncSamples,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}

export function useReviewSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      action: "APPROVE" | "REJECT";
      note?: string | null;
    }) => reviewSample(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}

export function useRefreshSampleFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshSampleFulfillment,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}

export function useCreateManualSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createManualSample,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["samples"] });
    },
  });
}
