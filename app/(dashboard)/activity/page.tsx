import { Suspense } from "react";
import { ActivityPageContent } from "@/components/activity/activity-page-content";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Activity",
  description:
    "Review audit events and changes made across your Tiksly organization.",
});

export default function ActivityPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <ActivityPageContent />
    </Suspense>
  );
}
