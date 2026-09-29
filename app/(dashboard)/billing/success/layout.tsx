import { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Subscription confirmed",
  description:
    "Your Tiksly subscription is active. Return to the dashboard to connect shops and start working with creators.",
});

export default function BillingSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
