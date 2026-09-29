import { OutreachPageContent } from "@/components/outreach/outreach-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Outreach",
  description:
    "Plan and send outreach to creators and follow up on affiliate conversations.",
});

export default function OutreachPage() {
  return <OutreachPageContent />;
}
