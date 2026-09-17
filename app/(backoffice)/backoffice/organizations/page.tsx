import { Suspense } from "react";
import { OrganizationsTable } from "@/components/backoffice/organizations/organizations-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <OrganizationsTable />
    </Suspense>
  );
}
