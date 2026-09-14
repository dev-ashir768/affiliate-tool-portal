"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { exportUsers, fetchUsers } from "@/services/users";
import type { UsersExportParams, UsersListParams } from "@/types/users";

export function useUsersQuery(params: UsersListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: ({ signal }) => fetchUsers(params, signal),
    placeholderData: (prev) => prev,
  });
}

export function useExportUsers() {
  return useMutation({
    mutationFn: (params: UsersExportParams) => exportUsers(params),
  });
}
