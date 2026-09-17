"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformCrawler } from "@/hooks/use-platform";

export default function CrawlerPage() {
  const query = usePlatformCrawler();

  if (query.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crawler</CardTitle>
        <CardDescription>
          Shop-verify worker queue status. Dedicated crawl runs ship next; use
          merchant shop verify for bot jobs today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
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
            <p>Queue: {query.data?.queue ?? "shop-verify"}</p>
            <p>
              Last run:{" "}
              {query.data?.lastRunAt
                ? new Date(query.data.lastRunAt).toLocaleString()
                : "Never"}
            </p>
            {query.data?.note ? <p>{query.data.note}</p> : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
