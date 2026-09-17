"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNavigation } from "@/services/navigation";
import type { NavArea } from "@/types/navigation";

export function useNavigation(area: NavArea) {
  return useQuery({
    queryKey: ["navigation", area],
    queryFn: ({ signal }) => fetchNavigation(area, signal),
  });
}
