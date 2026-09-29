/** Merchant app paths reachable before an active subscription / trial. */
export function merchantPathAllowedBeforeSubscribe(pathname: string): boolean {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  if (path === "/onboarding" || path.startsWith("/onboarding/")) return true;
  if (path === "/billing" || path.startsWith("/billing/")) return true;
  return false;
}
