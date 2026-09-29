import { FinanceOverview } from "@/components/backoffice/finance/finance-overview";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Finance",
  description:
    "Monitor platform revenue, Stripe subscriptions, and billing health for Tiksly.",
});

export default function FinancePage() {
  return <FinanceOverview />;
}
