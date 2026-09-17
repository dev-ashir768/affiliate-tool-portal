"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformProxies } from "@/hooks/use-platform";

export default function ProxiesPage() {
  const query = usePlatformProxies();

  if (query.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxies</CardTitle>
        <CardDescription>
          {query.data?.meta.note ??
            "Proxy management scaffolding — coming later"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {query.isError
          ? query.error instanceof Error
            ? query.error.message
            : "Unable to load proxies"
          : `${query.data?.meta.total ?? 0} proxies configured.`}
      </CardContent>
    </Card>
  );
}
