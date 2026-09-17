"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePlatformCrawler,
  useRunPlatformCrawlerDryCheck,
} from "@/hooks/use-platform";

export function CrawlerPageContent() {
  const query = usePlatformCrawler();
  const run = useRunPlatformCrawlerDryCheck();

  async function onDryCheck() {
    try {
      const result = await run.mutateAsync();
      toast.success(`Dry-run queued (${result.jobId})`);
      void query.refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to enqueue dry-run",
      );
    }
  }

  if (query.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const counts = query.data?.counts;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Crawler</CardTitle>
          <CardDescription>
            Worker queue health and dry-run checks. Merchant shop verify still
            uses the separate shop-verify queue.
          </CardDescription>
        </div>
        <Button
          type="button"
          onClick={() => void onDryCheck()}
          disabled={run.isPending}
        >
          {run.isPending ? "Queuing…" : "Run dry check"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {query.isError ? (
          <p className="text-destructive" role="alert">
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load crawler status"}
          </p>
        ) : (
          <>
            <p>
              Status:{" "}
              <span className="font-medium text-foreground">
                {query.data?.status ?? "—"}
              </span>
            </p>
            <p>Queue: {query.data?.queue ?? "crawler-check"}</p>
            <p>
              Last run:{" "}
              {query.data?.lastRunAt
                ? new Date(query.data.lastRunAt).toLocaleString()
                : "Never"}
            </p>
            {query.data?.lastJobId ? (
              <p>
                Last job: {query.data.lastJobId}
                {query.data.lastJobState
                  ? ` (${query.data.lastJobState})`
                  : ""}
              </p>
            ) : null}
            {counts ? (
              <p>
                Waiting {counts.waiting} · Active {counts.active} · Completed{" "}
                {counts.completed} · Failed {counts.failed}
              </p>
            ) : null}
            {query.data?.note ? <p>{query.data.note}</p> : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
