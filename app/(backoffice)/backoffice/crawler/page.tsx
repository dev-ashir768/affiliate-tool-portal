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
          {query.data?.note ?? "Crawler console scaffolding — coming later"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        {query.isError ? (
          <p className="text-destructive">
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load crawler status"}
          </p>
        ) : (
          <>
            <p>
              Status:{" "}
              <span className="font-medium">{query.data?.status ?? "—"}</span>
            </p>
            <p className="text-muted-foreground">
              Last run: {query.data?.lastRunAt ?? "Never"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
