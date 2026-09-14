"use client";

import { useQuery } from "@tanstack/react-query";
import type { NavArea, NavResponse } from "@/types/navigation";

async function fetchNavigation(area: NavArea): Promise<NavResponse> {
  const res = await fetch(`/data/navigation/${area}.json`);
  if (!res.ok) throw new Error("Couldn't load navigation");
  return res.json() as Promise<NavResponse>;
}

export function useNavigation(area: NavArea) {
  return useQuery({
    queryKey: ["navigation", area],
    queryFn: () => fetchNavigation(area),
  });
}
