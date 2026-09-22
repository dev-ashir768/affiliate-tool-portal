"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PlanCard } from "@/components/billing/plan-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBillingPlans } from "@/hooks/use-billing-plans";
import { useCheckoutSession } from "@/hooks/use-billing-actions";
import { useMe } from "@/hooks/use-me";
import { useOrg } from "@/hooks/use-org";

export function OnboardingPageContent() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";
  const meQuery = useMe();
  const orgQuery = useOrg();
  const plansQuery = useBillingPlans();
  const checkout = useCheckoutSession();
  const [activePlanCode, setActivePlanCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const orgRole = useMemo(() => {
    const me = meQuery.data;
    if (!me?.currentOrganizationId) return null;
    return (
      me.memberships.find((m) => m.organization.id === me.currentOrganizationId)
        ?.role ?? null
    );
  }, [meQuery.data]);

  const canManage = orgRole === "OWNER" || orgRole === "ADMIN";
  const isLoading =
    meQuery.isLoading || orgQuery.isLoading || plansQuery.isLoading;

  async function handleSelect(planCode: string) {
    if (!canManage) {
      toast.error("Ask an owner or admin to choose a plan");
      return;
    }
    setActionError(null);
    setActivePlanCode(planCode);
    try {
      const session = await checkout.mutateAsync({ planCode });
      if (!session.url) {
        throw new Error("Checkout URL was not returned");
      }
      toast.success(
        session.mode === "upgrade"
          ? "Plan updated"
          : "Redirecting to Stripe Checkout",
      );
      window.location.href = session.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start checkout";
      setActionError(message);
      toast.error(message);
      setActivePlanCode(null);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
        <Skeleton className="h-16 w-full max-w-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (plansQuery.isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Plans unavailable</CardTitle>
            <CardDescription>
              {plansQuery.error instanceof Error
                ? plansQuery.error.message
                : "Unable to load subscription plans."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const plans = (plansQuery.data?.plans ?? []).filter((p) => p.code !== "free");
  const orgName = orgQuery.data?.name ?? "your workspace";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Welcome to Tiksly
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Choose a plan for {orgName}
        </h1>
        <p className="text-muted-foreground">
          Product features unlock after an active subscription or trial. Pick a
          plan below to get started — you can upgrade anytime.
        </p>
      </div>

      {canceled ? (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          Checkout was canceled. Choose a plan when you are ready.
        </p>
      ) : null}

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          Only organization owners and admins can start a subscription. Ask them
          to complete onboarding.
        </p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={false}
            canManage={canManage}
            isLoading={checkout.isPending && activePlanCode === plan.code}
            onSelect={(code) => void handleSelect(code)}
            ctaLabel={
              plan.trialDays > 0
                ? `Start ${plan.trialDays}-day trial`
                : "Subscribe"
            }
          />
        ))}
      </div>
    </div>
  );
}
