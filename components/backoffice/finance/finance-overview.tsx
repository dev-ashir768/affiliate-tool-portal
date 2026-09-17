"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingOverview } from "@/hooks/use-platform";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function FinanceOverview() {
  const query = useBillingOverview();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finance unavailable</CardTitle>
          <CardDescription>
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load billing overview."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const data = query.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground">
          Subscription and revenue overview across all organizations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Organizations</CardDescription>
            <CardTitle>{data.organizationCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Paid / Free</CardDescription>
            <CardTitle>
              {data.paidOrganizationCount} / {data.freeOrganizationCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Approx. MRR</CardDescription>
            <CardTitle>{formatMoney(data.mrrCents)}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>ARPU (paid)</CardDescription>
            <CardTitle>{formatMoney(data.avgMrrPerPaidOrgCents)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Active</CardDescription>
            <CardTitle>{data.activeSubscriptionCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Trialing</CardDescription>
            <CardTitle>{data.trialingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Past due</CardDescription>
            <CardTitle>{data.pastDueCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.revenueByPlan.length === 0 ? (
              <p className="text-muted-foreground">No paid plans yet.</p>
            ) : (
              data.revenueByPlan.map((row) => (
                <div
                  key={row.planCode}
                  className="flex items-center justify-between border-b border-border py-2 last:border-0"
                >
                  <span>
                    {row.planName}{" "}
                    <span className="text-muted-foreground">
                      ({row.orgCount} × {formatMoney(row.monthlyPriceCents)})
                    </span>
                  </span>
                  <span className="font-medium">{formatMoney(row.mrrCents)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.subscriptionsByStatus.length === 0 ? (
              <p className="text-muted-foreground">No subscriptions yet.</p>
            ) : (
              data.subscriptionsByStatus.map((row) => (
                <div
                  key={row.status}
                  className="flex items-center justify-between border-b border-border py-2 last:border-0"
                >
                  <span>{row.status}</span>
                  <span className="font-medium">{row.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
