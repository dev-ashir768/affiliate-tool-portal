import { AnalyticsPageContent } from "@/components/analytics/analytics-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Analytics",
  description:
    "Analyze creator and campaign performance metrics for your TikTok Shop affiliates.",
});

export default function AnalyticsPage() {
  return <AnalyticsPageContent />;
}
