/**
 * End-user IP as seen by our reverse proxy. Prefer X-Real-IP (set by nginx to
 * $remote_addr); else the last X-Forwarded-For hop, which the proxy appended —
 * the first hop is client-controlled and spoofable.
 */
export function clientIpFromHeaders(h: Headers): string | undefined {
  const real = h.get("x-real-ip")?.trim();
  if (real) return real;
  const hops = h
    .get("x-forwarded-for")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return hops?.length ? hops[hops.length - 1] : undefined;
}
