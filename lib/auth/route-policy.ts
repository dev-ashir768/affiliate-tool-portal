/**
 * Edge route policy — conventions, not a page inventory.
 *
 * - Guest auth: anonymous-only (bounce if session exists)
 * - Token auth: email/invite links (reachable with or without session)
 * - Staff area: `/backoffice/*`
 * - Merchant area: every other app path (deny-by-default)
 */

const GUEST_AUTH = new Set(["/login", "/signup", "/forgot-password"]);

const TOKEN_AUTH_EXACT = new Set(["/reset-password"]);

function isInvitePath(pathname: string) {
  return pathname === "/invite" || pathname.startsWith("/invite/");
}

export type RouteClass =
  | "entry"
  | "guest_auth"
  | "token_auth"
  | "staff"
  | "merchant";

/** Classify a pathname for proxy guards. */
export function classifyRoute(pathname: string): RouteClass {
  if (pathname === "/") return "entry";

  if (GUEST_AUTH.has(pathname)) return "guest_auth";

  if (TOKEN_AUTH_EXACT.has(pathname) || isInvitePath(pathname)) {
    return "token_auth";
  }

  if (pathname === "/backoffice" || pathname.startsWith("/backoffice/")) {
    return "staff";
  }

  // Remaining app routes require a merchant (org) session.
  return "merchant";
}

export function isProtectedRoute(kind: RouteClass) {
  return kind === "staff" || kind === "merchant";
}

/**
 * Merchant routes reachable without an active subscription / trial.
 * Everything else redirects to /onboarding until hasProductAccess.
 */
export function isSubscriptionExemptPath(pathname: string): boolean {
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return true;
  }
  if (pathname === "/billing" || pathname.startsWith("/billing/")) {
    return true;
  }
  if (pathname === "/settings" || pathname.startsWith("/settings/")) {
    return true;
  }
  if (pathname === "/team" || pathname.startsWith("/team/")) {
    return true;
  }
  return false;
}
