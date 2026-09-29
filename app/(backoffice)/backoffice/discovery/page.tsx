import { PlatformDiscoveryPageContent } from "@/components/backoffice/discovery/platform-discovery-page";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Discovery",
  description:
    "Configure creator discovery sources, indexing, and platform-wide search settings.",
});

export default function BackofficeDiscoveryPage() {
  return <PlatformDiscoveryPageContent />;
}
