import { PlatformBotsPage } from "@/components/backoffice/bots/platform-bots-page";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Bots",
  description: "Manage the bot identity pool used for TikTok Shop collaborator connections.",
});

export default function BackofficeBotsPage() {
  return <PlatformBotsPage />;
}
