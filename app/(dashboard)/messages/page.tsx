import { MessagesPageContent } from "@/components/messages/messages-page-content";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Messages",
  description:
    "View and reply to creator messages tied to your TikTok Shop affiliate work.",
});

export default function MessagesPage() {
  return <MessagesPageContent />;
}
