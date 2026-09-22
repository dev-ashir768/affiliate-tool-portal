"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAffiliateInvite,
  fetchAffiliateInvites,
  fetchInviteProducts,
} from "@/services/invites";

export function useAffiliateInvites() {
  return useQuery({
    queryKey: ["affiliate-invites"],
    queryFn: ({ signal }) => fetchAffiliateInvites(signal),
    retry: false,
  });
}

export function useInviteProducts(shopId: string | null) {
  return useQuery({
    queryKey: ["invite-products", shopId],
    queryFn: ({ signal }) =>
      fetchInviteProducts(shopId!, { pageSize: 50, signal }),
    enabled: Boolean(shopId),
    retry: false,
  });
}

export function useCreateAffiliateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAffiliateInvite,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["affiliate-invites"] });
      void qc.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}
