import { CreatorsPageContent } from "@/components/creators/creators-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Creators",
  description:
    "Track creators you work with, their performance, and affiliate relationships on TikTok Shop.",
});

export default function CreatorsPage() {
  return <CreatorsPageContent />;
}
