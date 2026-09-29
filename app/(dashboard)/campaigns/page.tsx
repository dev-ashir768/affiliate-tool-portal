import { CampaignsPageContent } from "@/components/campaigns/campaigns-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Campaigns",
  description:
    "Create and monitor TikTok Shop affiliate campaigns, goals, and creator participation.",
});

export default function CampaignsPage() {
  return <CampaignsPageContent />;
}
