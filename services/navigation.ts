import type { NavArea, NavResponse } from "@/types/navigation";

export async function fetchNavigation(
  area: NavArea,
  signal?: AbortSignal
): Promise<NavResponse> {
  const res = await fetch(`/api/navigation/${area}`, {
    credentials: "include",
    signal,
  });
  if (!res.ok) throw new Error("Couldn't load navigation");
  return res.json() as Promise<NavResponse>;
}
