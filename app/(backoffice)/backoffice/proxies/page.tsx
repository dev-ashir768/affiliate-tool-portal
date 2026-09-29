import { ProxiesPageContent } from "@/components/backoffice/proxies/proxies-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Proxies",
  description:
    "Manage outbound proxy pools used by Tiksly crawlers and TikTok integrations.",
});

export default function ProxiesPage() {
  return <ProxiesPageContent />;
}
