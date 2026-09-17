import { Suspense } from "react";
import { AuditLogPage } from "@/components/backoffice/audit/audit-log-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function BackofficeAuditPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <AuditLogPage />
    </Suspense>
  );
}
