import { CrawlerPageContent } from "@/components/backoffice/crawler/crawler-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Crawler",
  description:
    "Control creator and catalog crawlers, schedules, and ingestion jobs for Tiksly.",
});

export default function CrawlerPage() {
  return <CrawlerPageContent />;
}
