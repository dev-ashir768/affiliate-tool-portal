import { Suspense } from "react";
import { PlatformShopsTable } from "@/components/backoffice/shops/platform-shops-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function BackofficeShopsPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <PlatformShopsTable />
    </Suspense>
  );
}
