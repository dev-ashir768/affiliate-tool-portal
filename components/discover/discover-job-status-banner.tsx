"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OrgDiscoveryJobStatus } from "@/types/commerce";

function kindLabel(kind: OrgDiscoveryJobStatus["kind"]) {
  if (kind === "crm_metrics_refresh") return "CRM metrics refresh";
  if (kind === "discovery_sync") return "Discovery sync";
  return "Background job";
}

function statusLabel(status: OrgDiscoveryJobStatus["status"]) {
  switch (status) {
    case "QUEUED":
      return "Queued";
    case "RUNNING":
      return "Running";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    default:
      return status;
  }
}

function statusBadgeVariant(
  status: OrgDiscoveryJobStatus["status"],
): "secondary" | "outline" | "destructive" | "default" {
  if (status === "FAILED") return "destructive";
  if (status === "COMPLETED") return "default";
  if (status === "RUNNING") return "secondary";
  return "outline";
}

function summarizeResult(job: OrgDiscoveryJobStatus): string | null {
  const r = job.result;
  if (!r) return null;
  if (job.kind === "crm_metrics_refresh") {
    const refreshed = typeof r.refreshed === "number" ? r.refreshed : null;
    const skipped = typeof r.skipped === "number" ? r.skipped : null;
    const failed = typeof r.failed === "number" ? r.failed : null;
    if (refreshed == null && skipped == null && failed == null) return null;
    return `Refreshed ${refreshed ?? 0}, skipped ${skipped ?? 0}, failed ${failed ?? 0}`;
  }
  const imported = typeof r.imported === "number" ? r.imported : null;
  const updated = typeof r.updated === "number" ? r.updated : null;
  const pages = typeof r.pages === "number" ? r.pages : null;
  if (imported == null && updated == null) return null;
  return `Imported ${imported ?? 0}, updated ${updated ?? 0}${
    pages != null ? ` (${pages} pages)` : ""
  }`;
}

export function DiscoverJobStatusBanner({
  job,
  isLoading,
  isError,
  errorMessage,
  onDismiss,
}: {
  job: OrgDiscoveryJobStatus | undefined;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onDismiss: () => void;
}) {
  const terminal =
    job?.status === "COMPLETED" ||
    job?.status === "FAILED" ||
    Boolean(isError);

  const summary = job ? summarizeResult(job) : null;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">
            {job ? kindLabel(job.kind) : "Queued job"}
          </p>
          {job ? (
            <Badge variant={statusBadgeVariant(job.status)}>
              {statusLabel(job.status)}
            </Badge>
          ) : isLoading ? (
            <Badge variant="outline">Checking…</Badge>
          ) : null}
          {job?.jobId ? (
            <span className="font-mono text-xs text-muted-foreground">
              #{job.jobId}
            </span>
          ) : null}
        </div>
        {isError ? (
          <p className="text-sm text-destructive">
            {errorMessage ?? "Unable to load job status"}
          </p>
        ) : null}
        {job?.status === "FAILED" && job.failedReason ? (
          <p className="text-sm text-destructive">{job.failedReason}</p>
        ) : null}
        {summary ? (
          <p className="text-sm text-muted-foreground">{summary}</p>
        ) : job?.status === "QUEUED" || job?.status === "RUNNING" ? (
          <p className="text-sm text-muted-foreground">
            Status updates automatically. Creators appear in the table when
            this finishes.
          </p>
        ) : null}
      </div>
      {terminal ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      ) : null}
    </div>
  );
}
