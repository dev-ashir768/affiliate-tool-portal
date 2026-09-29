import { OrdersPageContent } from "@/components/orders/orders-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Orders",
  description:
    "Track affiliate-attributed TikTok Shop orders and commission-related activity.",
});

export default function OrdersPage() {
  return <OrdersPageContent />;
}
