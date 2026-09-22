import { Suspense } from "react";
import { ShopsPageContent } from "@/components/shops/shops-page-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <ShopsPageContent />
    </Suspense>
  );
}
