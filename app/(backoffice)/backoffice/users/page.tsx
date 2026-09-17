import { Suspense } from "react";
import { StaffTable } from "@/components/backoffice/staff/staff-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function UsersPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <StaffTable />
    </Suspense>
  );
}
