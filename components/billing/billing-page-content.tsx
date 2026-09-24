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
import {
  useCheckoutSession,
  usePortalSession,
} from "@/hooks/use-billing-actions";
import { useBillingOverview } from "@/hooks/use-billing-overview";
import { useMe } from "@/hooks/use-me";

function formatStatus(status: string | null | undefined) {
  if (!status) return "None";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ctaForPlan(kind: string | undefined, trialDays: number) {
  switch (kind) {
    case "upgrade":
      return "Upgrade";
    case "downgrade":
      return "Downgrade";
    case "subscribe":
      return trialDays > 0 ? `Start ${trialDays}-day trial` : "Subscribe";
    default:
      return "Switch plan";
  }
}

export function BillingPageContent() {
  const meQuery = useMe();
  const overviewQuery = useBillingOverview();
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
  const data = overviewQuery.data;
  const hasPaidSubscription = Boolean(
    data?.subscription && data.hasProductAccess,
  );

  const isLoading = meQuery.isLoading || overviewQuery.isLoading;

  async function handlePlanChange(planCode: string) {
    setActionError(null);
    setActivePlanCode(planCode);
    try {
      const session = await checkout.mutateAsync({ planCode });
      if (!session.url) throw new Error("Checkout URL was not returned");
      toast.success(
        session.mode === "downgrade"
          ? "Applying downgrade…"
          : session.mode === "upgrade"
            ? "Applying upgrade…"
            : "Redirecting to Stripe Checkout",
      );
      window.location.href = session.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change plan";
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (overviewQuery.isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing unavailable</CardTitle>
          <CardDescription>
            {overviewQuery.error instanceof Error
              ? overviewQuery.error.message
              : "Unable to load billing information."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const org = data.organization;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Upgrade, downgrade, and manage limits for your workspace.
          </p>
        </div>
        {canManage && hasPaidSubscription ? (
          <Button
            variant="outline"
            disabled={portal.isPending}
            onClick={() => void handleManageSubscription()}
          >
            {portal.isPending ? "Opening…" : "Manage / cancel in Stripe"}
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan & usage</CardTitle>
          <CardDescription>
            Limits are enforced when adding seats, shops, or bots.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="font-medium">{org.planName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subscription</p>
            <p className="font-medium">
              {formatStatus(data.subscription?.status)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seats</p>
            <p className="font-medium">
              {data.usage.seats} / {org.seatLimit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Shops</p>
            <p className="font-medium">
              {data.usage.shops} / {org.shopLimit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bots</p>
            <p className="font-medium">
              {data.usage.bots} / {org.botLimit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Daily invites</p>
            <p className="font-medium">{org.dailyInviteQuota}</p>
          </div>
          {data.subscription?.currentPeriodEnd ? (
            <div>
              <p className="text-xs text-muted-foreground">Period ends</p>
              <p className="font-medium">
                {new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {data.hasOverage ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Over plan limits</CardTitle>
            <CardDescription>
              Reduce usage before downgrading further. New adds stay blocked
              until you are under the caps.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {[
              data.overage.seats > 0
                ? `${data.overage.seats} seat(s) over — manage /team`
                : null,
              data.overage.shops > 0
                ? `${data.overage.shops} shop(s) over — manage /shops`
                : null,
              data.overage.bots > 0
                ? `${data.overage.bots} bot(s) over — disconnect shops using bots`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Upgrade & downgrade rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Upgrade: </span>
            {data.rules.upgrade}
          </p>
          <p>
            <span className="font-medium text-foreground">Downgrade: </span>
            {data.rules.downgrade}
          </p>
          <p>
            <span className="font-medium text-foreground">Cancel: </span>
            {data.rules.cancel}
          </p>
          <p className="font-medium text-foreground">Affected by plan change:</p>
          <ul className="list-disc pl-5">
            {data.rules.effects.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.changeKind === "current"}
            canManage={canManage}
            isLoading={checkout.isPending && activePlanCode === plan.code}
            disabledReason={
              plan.changeKind === "downgrade" && !plan.canSwitch
                ? plan.blockers
                    ?.map((b) => `${b.resource}: ${b.used}/${b.limit}`)
                    .join(", ")
                : undefined
            }
            onSelect={(code) => void handlePlanChange(code)}
            ctaLabel={ctaForPlan(plan.changeKind, plan.trialDays)}
            allowSelect={Boolean(plan.canSwitch)}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Checkout and plan changes use Stripe proration. Activity is recorded in{" "}
        <Link href="/activity" className="underline underline-offset-4">
          Activity
        </Link>
        .
      </p>
    </div>
  );
}
