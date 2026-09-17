"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/services/auth";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: ({ signal }) => fetchMe(signal),
    staleTime: 60_000,
    retry: false,
  });
}
