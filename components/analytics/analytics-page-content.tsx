"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsOverview } from "@/hooks/use-commerce";

function formatMoney(cents: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function AnalyticsPageContent() {
  const query = useAnalyticsOverview();

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  if (query.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {query.error instanceof Error
          ? query.error.message
          : "Unable to load analytics"}
      </p>
    );
  }

  const f = query.data!.funnel;
  const cards = [
    { label: "Creators", value: String(f.creators) },
    { label: "Invited / active", value: String(f.contactedOrInvited) },
    { label: "Outreach sent", value: String(f.outreachSent) },
    { label: "Orders", value: String(f.orders) },
    { label: "GMV", value: formatMoney(f.gmvCents) },
    { label: "Commission", value: formatMoney(f.commissionCents) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Invite → outreach → order funnel from live CRM and attribution data.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Recent orders</h2>
        <ul className="space-y-2 text-sm">
          {(query.data?.recentOrders ?? []).length === 0 ? (
            <li className="text-muted-foreground">No orders yet.</li>
          ) : (
            query.data!.recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="font-mono text-xs">{o.externalOrderId}</span>
                <span>{formatMoney(o.gmvCents)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
