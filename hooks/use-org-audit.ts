"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrgAudit } from "@/services/orgs";
import type { OrgAuditListParams } from "@/types/orgs";

export function useOrgAudit(params: OrgAuditListParams) {
  return useQuery({
    queryKey: ["org", "audit", params],
    queryFn: ({ signal }) => fetchOrgAudit(params, signal),
    placeholderData: (prev) => prev,
    retry: false,
  });
}
