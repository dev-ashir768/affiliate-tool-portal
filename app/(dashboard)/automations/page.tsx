import { AutomationsPageContent } from "@/components/automations/automations-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Automations",
  description:
    "Configure automated workflows for outreach, follow-ups, and affiliate operations.",
});

export default function AutomationsPage() {
  return <AutomationsPageContent />;
}
