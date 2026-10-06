import { Suspense } from "react";
import { OrganizationsTable } from "@/components/backoffice/organizations/organizations-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Organizations",
  description:
    "Browse customer organizations, subscriptions, and tenant status across influxa.",
});

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <OrganizationsTable />
    </Suspense>
  );
}
