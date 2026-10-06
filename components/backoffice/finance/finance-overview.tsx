"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { FinanceCharts } from "@/components/backoffice/finance/finance-charts";
import { useBillingOverview } from "@/hooks/use-platform";
import { cn } from "cn";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";

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
      <SectionCard title="Finance unavailable">
        <p className="text-sm text-destructive">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load billing overview."}
        </p>
      </SectionCard>
    );
  }

  const data = query.data;
  const stripeDash = "https://dashboard.stripe.com";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance"
        description="High-level SaaS health — customers, funnel, MRR, and invoicing ownership."
        actions={
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
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total customers", value: String(data.organizationCount), sub: undefined },
          {
            label: "With product access",
            value: String(data.withProductAccessCount),
            sub: "ACTIVE + TRIALING + PAST_DUE",
          },
          {
            label: "Paid / Free",
            value: `${data.paidOrganizationCount} / ${data.freeOrganizationCount}`,
            sub: undefined,
          },
          {
            label: "Approx. MRR",
            value: formatMoney(data.mrrCents),
            sub: `ARPU ${formatMoney(data.avgMrrPerPaidOrgCents)}${data.funnel ? ` · ${data.funnel.conversionRate}% convert` : ""}`,
          },
        ].map((c) => (
          <div
            key={c.label}
            className="flex flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/[0.08]"
          >
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{c.value}</p>
            {c.sub ? (
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            ) : null}
          </div>
        ))}
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
        <SectionCard
          title="Recent lifecycle"
          description={
            <>
              Who upgraded, renewed, or canceled — with plan changes like{" "}
              <span className="font-medium text-foreground">
                starter → growth
              </span>
              .
            </>
          }
          contentClassName="px-0"
        >
          {(data.recentLifecycle ?? []).length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">
              No lifecycle events yet. New registrations and Stripe
              subscribe/renew/upgrade events will appear here.
            </p>
          ) : (
            <ul className="divide-y text-sm">
              {(data.recentLifecycle ?? []).map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
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
        </SectionCard>
      ) : null}

      <SectionCard
        title="Where money & invoices are managed"
        description={
          data.notes?.invoicing ??
          "Invoices live in Stripe; this console shows tenant health from our DB."
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium">Merchants</p>
            <p className="mt-1 text-muted-foreground">
              Checkout + Customer Portal at{" "}
              <code className="text-xs">/billing</code>.
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
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
          <div className="rounded-lg border border-border p-3">
            <p className="font-medium">MRR note</p>
            <p className="mt-1 text-muted-foreground">
              {data.notes?.mrrBasis ??
                "Approx. catalog MRR — not live Stripe revenue."}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
