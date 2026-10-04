import { redirect } from "next/navigation";
import { getVerifiedSessionClaims } from "./session";

/**
 * Defense-in-depth for RSC layouts.
 * Subscription path exemptions stay in proxy — layouts only enforce role/session.
 */
export async function requireMerchantArea() {
  const claims = await getVerifiedSessionClaims();
  if (!claims) redirect("/login");
  if (claims.platformRole) redirect("/backoffice/users");
  if (!claims.orgId) redirect("/login");
  return claims;
}

export async function requireStaffArea() {
  const claims = await getVerifiedSessionClaims();
  if (!claims) redirect("/login");
  if (!claims.platformRole) {
    redirect(claims.hasProductAccess ? "/home" : "/onboarding");
  }
  return claims;
}
