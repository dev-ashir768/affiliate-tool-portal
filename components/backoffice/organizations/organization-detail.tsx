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
import { usePlatformOrganization } from "@/hooks/use-platform";

export function OrganizationDetail({ id }: { id: string }) {
  const query = usePlatformOrganization(id);

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization unavailable</CardTitle>
          <CardDescription>
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load organization."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/backoffice/organizations"
            className={buttonVariants({ variant: "outline" })}
          >
            Back to organizations
          </Link>
        </CardContent>
      </Card>
    );
  }

  const org = query.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/backoffice/organizations"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← Organizations
          </Link>
          <h1 className="mt-1 text-lg font-semibold tracking-tight">
            {org.name}
          </h1>
          <p className="text-sm text-muted-foreground">{org.slug}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Plan</CardDescription>
            <CardTitle>{org.plan.name}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Subscription</CardDescription>
            <CardTitle>{org.subscriptionStatus ?? "None"}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Product access</CardDescription>
            <CardTitle>{org.hasProductAccess ? "Yes" : "No"}</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Members / Shops</CardDescription>
            <CardTitle>
              {org.members.length} / {org.shops.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Invoices and payment methods are managed in Stripe. Merchants open
            Customer Portal from /billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Period end</p>
              <p className="font-medium">
                {org.currentPeriodEnd
                  ? new Date(org.currentPeriodEnd).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stripe customer</p>
              <p className="font-mono text-xs">
                {org.stripeCustomerId ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stripe subscription</p>
              <p className="font-mono text-xs">
                {org.stripeSubscriptionId ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {org.stripeCustomerId ? (
              <a
                href={`https://dashboard.stripe.com/customers/${org.stripeCustomerId}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Open Stripe customer
              </a>
            ) : null}
            {org.stripeSubscriptionId ? (
              <a
                href={`https://dashboard.stripe.com/subscriptions/${org.stripeSubscriptionId}`}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Open Stripe subscription
              </a>
            ) : null}
            <Link
              href="/backoffice/finance"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Finance overview
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {org.members.length === 0 ? (
            <p className="text-muted-foreground">No members.</p>
          ) : (
            org.members.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{m.user.name}</p>
                  <p className="text-muted-foreground">{m.user.email}</p>
                </div>
                <p className="text-muted-foreground">
                  {m.role} · {m.status}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shops</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {org.shops.length === 0 ? (
            <p className="text-muted-foreground">No shops.</p>
          ) : (
            org.shops.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {s.displayName ?? s.externalShopId ?? s.id}
                  </p>
                  <p className="text-muted-foreground">
                    {s.region} · {s.botEmail ?? "no bot"}
                  </p>
                </div>
                <p className="text-muted-foreground">{s.status}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
