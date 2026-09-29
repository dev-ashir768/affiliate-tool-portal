import { Suspense } from "react";
import { StaffTable } from "@/components/backoffice/staff/staff-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Staff",
  description:
    "Manage platform staff accounts, roles, and access to Tiksly backoffice tools.",
});

export default function UsersPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <StaffTable />
    </Suspense>
  );
}
