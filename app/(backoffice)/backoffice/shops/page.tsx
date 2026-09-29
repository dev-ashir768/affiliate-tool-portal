import { Suspense } from "react";
import { PlatformShopsTable } from "@/components/backoffice/shops/platform-shops-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Shops",
  description:
    "View TikTok Shop connections across all organizations on the Tiksly platform.",
});

export default function BackofficeShopsPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <PlatformShopsTable />
    </Suspense>
  );
}
