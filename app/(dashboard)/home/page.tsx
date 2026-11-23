import { HomeOverview } from "@/components/home/home-overview";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Overview",
  description:
    "See a snapshot of your TikTok shops, subscription usage, and recent activity in affimaticapp.",
});

export default function HomePage() {
  return <HomeOverview />;
}
