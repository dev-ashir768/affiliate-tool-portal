"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBillingPlans } from "@/services/billing";

export function useBillingPlans() {
  return useQuery({
    queryKey: ["billing", "plans"],
    queryFn: ({ signal }) => fetchBillingPlans(signal),
    staleTime: 60_000,
    retry: false,
  });
}
