import { Suspense } from "react";
import { AuditLogPage } from "@/components/backoffice/audit/audit-log-page";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Audit log",
  description:
    "Review platform-wide audit events and administrative actions in influxa backoffice.",
});

export default function BackofficeAuditPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <AuditLogPage />
    </Suspense>
  );
}
