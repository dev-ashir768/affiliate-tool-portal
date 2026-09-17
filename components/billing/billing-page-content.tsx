"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { PlanCard } from "@/components/billing/plan-card";
import { useBillingPlans } from "@/hooks/use-billing-plans";
import {
  useCheckoutSession,
  usePortalSession,
} from "@/hooks/use-billing-actions";
import { useMe } from "@/hooks/use-me";
import { useOrg } from "@/hooks/use-org";

function formatStatus(status: string | null) {
  if (!status) return "None";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BillingPageContent() {
  const meQuery = useMe();
  const orgQuery = useOrg();
  const plansQuery = useBillingPlans();
  const checkout = useCheckoutSession();
  const portal = usePortalSession();
  const [actionError, setActionError] = useState<string | null>(null);
  const [activePlanCode, setActivePlanCode] = useState<string | null>(null);

  const orgRole = useMemo(() => {
    const me = meQuery.data;
    if (!me?.currentOrganizationId) return null;
    return (
      me.memberships.find(
        (m) => m.organization.id === me.currentOrganizationId,
      )?.role ?? null
    );
  }, [meQuery.data]);

  const canManage = orgRole === "OWNER" || orgRole === "ADMIN";
  const org = orgQuery.data;
  const currentPlanCode = org?.plan.code ?? null;
  const hasPaidSubscription =
    Boolean(org?.subscriptionStatus) || (currentPlanCode !== null && currentPlanCode !== "free");

  const isLoading =
    meQuery.isLoading || orgQuery.isLoading || plansQuery.isLoading;

  async function handleUpgrade(planCode: string) {
    setActionError(null);
    setActivePlanCode(planCode);
    try {
      const session = await checkout.mutateAsync({ planCode });
      if (!session.url) {
        throw new Error("Checkout URL was not returned");
      }
      toast.success("Redirecting to Stripe Checkout");
      window.location.href = session.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start checkout";
      setActionError(message);
      toast.error(message);
      setActivePlanCode(null);
    }
  }

  async function handleManageSubscription() {
    setActionError(null);
    try {
      const session = await portal.mutateAsync();
      toast.success("Opening Stripe billing portal");
      window.location.href = session.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to open billing portal";
      setActionError(message);
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (orgQuery.isError || plansQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing unavailable</CardTitle>
          <CardDescription>
            {orgQuery.error instanceof Error
              ? orgQuery.error.message
              : plansQuery.error instanceof Error
                ? plansQuery.error.message
                : "Unable to load billing information."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const plans = plansQuery.data?.plans ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your subscription and view available plans.
          </p>
        </div>
        {canManage && hasPaidSubscription ? (
          <Button
            variant="outline"
            disabled={portal.isPending}
            onClick={() => void handleManageSubscription()}
          >
            {portal.isPending ? "Opening…" : "Manage subscription"}
          </Button>
        ) : null}
      </div>

      {org ? (
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>
              Limits apply to your active organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="font-medium">{org.plan.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subscription</p>
              <p className="font-medium">{formatStatus(org.subscriptionStatus)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seats</p>
              <p className="font-medium">{org.seatLimit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Shops</p>
              <p className="font-medium">{org.shopLimit}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          Only organization owners and admins can change billing. You can view
          plan details below.
        </p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.code === currentPlanCode}
            canManage={canManage}
            isLoading={checkout.isPending && activePlanCode === plan.code}
            onSelect={(code) => void handleUpgrade(code)}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Checkout is powered by Stripe. After payment, your plan limits update
        automatically. Need help?{" "}
        <Link href="/settings" className="underline underline-offset-4">
          View organization settings
        </Link>
        .
      </p>
    </div>
  );
}
