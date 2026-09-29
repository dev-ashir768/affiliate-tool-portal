import { PlatformCreatorsPageContent } from "@/components/backoffice/creators/platform-creators-page";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Creators",
  description:
    "Curate and manage the global creator directory used for discovery across Tiksly.",
});

export default function BackofficeCreatorsPage() {
  return <PlatformCreatorsPageContent />;
}
