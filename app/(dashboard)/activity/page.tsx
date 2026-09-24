import { Suspense } from "react";
import { ActivityPageContent } from "@/components/activity/activity-page-content";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function ActivityPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <ActivityPageContent />
    </Suspense>
  );
}
