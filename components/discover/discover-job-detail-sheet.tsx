"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
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

function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 border-b border-border/60 py-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words">{value}</dd>
    </div>
  );
}

function resultRows(job: OrgDiscoveryJobStatus): Array<{
  label: string;
  value: ReactNode;
}> {
  const r = job.result;
  if (!r) return [];
  if (job.kind === "crm_metrics_refresh") {
    return [
      {
        label: "Refreshed",
        value: typeof r.refreshed === "number" ? r.refreshed : "—",
      },
      {
        label: "Skipped",
        value: typeof r.skipped === "number" ? r.skipped : "—",
      },
      {
        label: "Failed",
        value: typeof r.failed === "number" ? r.failed : "—",
      },
    ];
  }
  return [
    {
      label: "Imported",
      value: typeof r.imported === "number" ? r.imported : "—",
    },
    {
      label: "Updated",
      value: typeof r.updated === "number" ? r.updated : "—",
    },
    {
      label: "Skipped",
      value: typeof r.skipped === "number" ? r.skipped : "—",
    },
    {
      label: "CRM updated",
      value: typeof r.crmPropagated === "number" ? r.crmPropagated : "—",
    },
    {
      label: "Pages",
      value: typeof r.pages === "number" ? r.pages : "—",
    },
  ];
}

export type DiscoverJobHistoryItem = {
  jobId: string;
  job?: OrgDiscoveryJobStatus;
  isLoading?: boolean;
  isError?: boolean;
};

export function DiscoverJobDetailSheet({
  job,
  open,
  onOpenChange,
  onDismiss,
  canDismiss,
  history = [],
  selectedJobId,
  onSelectJob,
}: {
  job: OrgDiscoveryJobStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss?: () => void;
  canDismiss?: boolean;
  history?: DiscoverJobHistoryItem[];
  selectedJobId?: string | null;
  onSelectJob?: (jobId: string) => void;
}) {
  const rows = job ? resultRows(job) : [];
  const showHistory = history.length > 1 && onSelectJob;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {job || history.length > 0 ? (
          <>
            <SheetHeader className="border-b">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <SheetTitle>
                  {job ? kindLabel(job.kind) : "Job details"}
                </SheetTitle>
                {job ? (
                  <Badge variant={statusBadgeVariant(job.status)}>
                    {statusLabel(job.status)}
                  </Badge>
                ) : null}
              </div>
              <SheetDescription className="font-mono text-xs">
                {job
                  ? `Job #${job.jobId}`
                  : selectedJobId
                    ? `Job #${selectedJobId}`
                    : "Select a job"}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4">
              {showHistory ? (
                <div className="mb-4 border-b border-border/60 pb-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Recent jobs
                  </p>
                  <ul className="flex flex-col gap-1">
                    {history.map((item) => {
                      const active = item.jobId === selectedJobId;
                      const status = item.job?.status;
                      return (
                        <li key={item.jobId}>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                              active
                                ? "bg-muted font-medium"
                                : "hover:bg-muted/60",
                            )}
                            onClick={() => onSelectJob(item.jobId)}
                          >
                            <span className="font-mono text-xs">
                              #{item.jobId}
                            </span>
                            {status ? (
                              <Badge
                                variant={statusBadgeVariant(status)}
                                className="shrink-0"
                              >
                                {statusLabel(status)}
                              </Badge>
                            ) : item.isError ? (
                              <Badge variant="destructive">Missing</Badge>
                            ) : (
                              <Badge variant="outline">…</Badge>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {job ? (
                <>
                  <dl>
                    <DetailRow label="Status" value={statusLabel(job.status)} />
                    <DetailRow label="Queue" value={job.queue || "—"} />
                    <DetailRow
                      label="Requested"
                      value={formatWhen(job.requestedAt)}
                    />
                    <DetailRow
                      label="Started"
                      value={formatWhen(job.startedAt)}
                    />
                    <DetailRow
                      label="Finished"
                      value={formatWhen(job.finishedAt)}
                    />
                    {job.status === "FAILED" ? (
                      <DetailRow
                        label="Error"
                        value={
                          <span className="text-destructive">
                            {job.failedReason?.trim() || "Unknown error"}
                          </span>
                        }
                      />
                    ) : null}
                    {rows.map((row) => (
                      <DetailRow
                        key={row.label}
                        label={row.label}
                        value={row.value}
                      />
                    ))}
                  </dl>

                  {job.status === "QUEUED" || job.status === "RUNNING" ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      This updates automatically. Creators show in Discover when
                      the job finishes.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a job from the list to see details.
                </p>
              )}
            </div>

            {canDismiss && onDismiss ? (
              <SheetFooter className="border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onDismiss();
                    onOpenChange(false);
                  }}
                >
                  Dismiss
                </Button>
              </SheetFooter>
            ) : null}
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
