import { PlansAdminPage } from "@/components/backoffice/plans/plans-admin-page";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Subscription plans",
  description:
    "Configure influxa plan tiers, Stripe prices, limits, and feature flags for customer organizations.",
});

export default function BackofficePlansPage() {
  return <PlansAdminPage />;
}
