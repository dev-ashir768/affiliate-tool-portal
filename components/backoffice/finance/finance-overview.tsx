"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { FinanceCharts } from "@/components/backoffice/finance/finance-charts";
import { useBillingOverview } from "@/hooks/use-platform";
import { cn } from "cn";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function StatusLink({
  href,
  label,
  count,
}: {
  href: string;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="rounded-md border border-border px-3 py-3 transition-colors hover:bg-muted/40"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
        {count}
      </p>
    </Link>
  );
}

export function FinanceOverview() {
  const query = useBillingOverview();

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
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
  const stripeDash = "https://dashboard.stripe.com";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Finance</h1>
          <p className="text-sm text-muted-foreground">
            High-level SaaS health — customers, funnel, MRR, and invoicing
            ownership.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/backoffice/organizations"
            className={buttonVariants({ variant: "outline" })}
          >
            All customers
          </Link>
          <Link
            href="/backoffice/plans"
            className={buttonVariants({ variant: "outline" })}
          >
            Plans catalog
          </Link>
          <a
            href={`${stripeDash}/subscriptions`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants()}
          >
            Stripe Dashboard
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Total customers</CardDescription>
            <CardTitle className="tabular-nums">
              {data.organizationCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>With product access</CardDescription>
            <CardTitle className="tabular-nums">
              {data.withProductAccessCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            ACTIVE + TRIALING + PAST_DUE
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Paid / Free plan</CardDescription>
            <CardTitle className="tabular-nums">
              {data.paidOrganizationCount} / {data.freeOrganizationCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Approx. MRR</CardDescription>
            <CardTitle className="tabular-nums">
              {formatMoney(data.mrrCents)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            ARPU {formatMoney(data.avgMrrPerPaidOrgCents)}
            {data.funnel
              ? ` · ${data.funnel.conversionRate}% convert`
              : null}
          </CardContent>
        </Card>
      </div>

      <FinanceCharts data={data} />

      <div>
        <h2 className="mb-2 text-sm font-medium">Drill into status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=ACTIVE"
            label="Active"
            count={data.activeSubscriptionCount}
          />
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=TRIALING"
            label="Trialing"
            count={data.trialingCount}
          />
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=PAST_DUE"
            label="Past due"
            count={data.pastDueCount}
          />
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=CANCELED"
            label="Canceled"
            count={data.canceledCount}
          />
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=INCOMPLETE"
            label="Incomplete"
            count={data.incompleteCount}
          />
          <StatusLink
            href="/backoffice/organizations?subscriptionStatus=NONE"
            label="No subscription"
            count={data.noSubscriptionCount}
          />
        </div>
      </div>

      {data.funnel ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent lifecycle</CardTitle>
            <CardDescription>
              Who upgraded, renewed, or canceled — with plan changes like{" "}
              <span className="font-medium text-foreground">
                starter → growth
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(data.recentLifecycle ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No lifecycle events yet. New registrations and Stripe
                subscribe/renew/upgrade events will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border rounded-md border border-border text-sm">
                {(data.recentLifecycle ?? []).map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
                  >
                    <div>
                      <Link
                        href={`/backoffice/organizations/${e.organization.id}`}
                        className="font-medium hover:underline"
                      >
                        {e.organization.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {e.type}
                        {e.fromPlanCode || e.toPlanCode
                          ? ` · ${e.fromPlanCode ?? "—"} → ${e.toPlanCode ?? "—"}`
                          : null}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground tabular-nums">
                      {new Date(e.createdAt).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Where money & invoices are managed</CardTitle>
          <CardDescription>
            {data.notes?.invoicing ??
              "Invoices live in Stripe; this console shows tenant health from our DB."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-md border border-border p-3">
            <p className="font-medium">Merchants</p>
            <p className="mt-1 text-muted-foreground">
              Checkout + Customer Portal at{" "}
              <code className="text-xs">/billing</code>.
            </p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-medium">Platform staff</p>
            <p className="mt-1 text-muted-foreground">
              Counts & charts here; catalog on{" "}
              <Link href="/backoffice/plans" className="underline">
                Plans
              </Link>
              .
            </p>
            <a
              href={`${stripeDash}/invoices`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3",
              )}
            >
              Stripe invoices
            </a>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-medium">MRR note</p>
            <p className="mt-1 text-muted-foreground">
              {data.notes?.mrrBasis ??
                "Approx. catalog MRR — not live Stripe revenue."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
