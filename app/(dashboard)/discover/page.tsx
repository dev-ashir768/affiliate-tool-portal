import { DiscoverPageContent } from "@/components/discover/discover-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Discover",
  description:
    "Search and filter TikTok creators to find partners for your shop and campaigns.",
});

export default function DiscoverPage() {
  return <DiscoverPageContent />;
}
