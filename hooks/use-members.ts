"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "@/services/orgs";
import type { MembersListParams } from "@/types/orgs";

export function useMembersQuery(params: MembersListParams) {
  return useQuery({
    queryKey: ["org", "members", params],
    queryFn: ({ signal }) => fetchMembers(params, signal),
    placeholderData: (prev) => prev,
  });
}
