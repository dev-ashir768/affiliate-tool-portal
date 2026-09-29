import { SamplesPageContent } from "@/components/samples/samples-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Samples",
  description:
    "Review and fulfill product sample requests from creators in your affiliate program.",
});

export default function SamplesPage() {
  return <SamplesPageContent />;
}
