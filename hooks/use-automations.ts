"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAutomationRun,
  fetchAutomationRuns,
} from "@/services/automations";

export function useAutomationRuns() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: ({ signal }) => fetchAutomationRuns(signal),
    retry: false,
    refetchInterval: (q) => {
      const runs = q.state.data?.runs ?? [];
      return runs.some((r) => r.status === "QUEUED" || r.status === "RUNNING")
        ? 4000
        : false;
    },
  });
}

export function useCreateAutomationRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAutomationRun,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["automations"] });
      void qc.invalidateQueries({ queryKey: ["creators"] });
      void qc.invalidateQueries({ queryKey: ["affiliate-invites"] });
      void qc.invalidateQueries({ queryKey: ["outreach-messages"] });
    },
  });
}
