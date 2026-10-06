import { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Connecting TikTok Shop",
  description: "Completing TikTok Shop authorization for your influxa organization.",
  noIndex: true,
});

export default function TikTokCallbackLayout({ children }: { children: ReactNode }) {
  return children;
}
