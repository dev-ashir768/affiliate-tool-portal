import { BillingPageContent } from "@/components/billing/billing-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Billing",
  description:
    "View your Tiksly plan, manage Stripe billing, download invoices, and change subscription.",
});

export default function BillingPage() {
  return <BillingPageContent />;
}
