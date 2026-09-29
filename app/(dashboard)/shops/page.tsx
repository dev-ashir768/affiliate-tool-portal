import { Suspense } from "react";
import { ShopsPageContent } from "@/components/shops/shops-page-content";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Shops",
  description:
    "Connect and manage TikTok Shop stores linked to your Tiksly organization.",
});

export default function ShopsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <ShopsPageContent />
    </Suspense>
  );
}
