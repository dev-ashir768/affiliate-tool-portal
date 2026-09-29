import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Sign in",
  description:
    "Tiksly — TikTok Shop affiliate management for brands and agencies.",
});

/** Fallback if proxy does not run — prefer session-aware redirect in proxy.ts. */
export default function RootPage() {
  redirect("/login");
}
