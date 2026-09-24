"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBillingOverview } from "@/services/billing";

export function useBillingOverview() {
  return useQuery({
    queryKey: ["billing", "overview"],
    queryFn: ({ signal }) => fetchBillingOverview(signal),
    staleTime: 30_000,
    retry: false,
  });
}
