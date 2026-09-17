"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentOrg, patchCurrentOrg } from "@/services/orgs";
import type { PatchCurrentOrgSchemaType } from "@/validations/org.validations";

export function useOrg() {
  return useQuery({
    queryKey: ["org", "current"],
    queryFn: ({ signal }) => fetchCurrentOrg(signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function usePatchOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PatchCurrentOrgSchemaType) => patchCurrentOrg(body),
    onSuccess: (data) => {
      queryClient.setQueryData(["org", "current"], data);
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
