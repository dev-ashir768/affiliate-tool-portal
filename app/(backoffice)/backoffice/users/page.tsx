import { Suspense } from "react";
import { UsersTable } from "@/components/backoffice/users/users-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function UsersPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <UsersTable />
    </Suspense>
  );
}
