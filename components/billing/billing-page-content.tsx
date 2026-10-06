"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PlanCard } from "@/components/billing/plan-card";
import {
  useCheckoutSession,
  usePortalSession,
} from "@/hooks/use-billing-actions";
import { useBillingOverview } from "@/hooks/use-billing-overview";
import { useMe } from "@/hooks/use-me";
import { redirectToBillingUrl } from "@/lib/billing/stripe-redirect";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";

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

/** Visual usage bar for a single resource limit */
function UsageBar({
  label,
  used,
  limit,
  href,
}: {
  label: string;
  used: number;
  limit: number;
  href?: string;
}) {
  const unlimited = limit <= 0;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const over = !unlimited && used > limit;
  const warn = !unlimited && pct >= 80;

  const barColor = over
    ? "bg-destructive"
    : warn
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span
          className={
            over
              ? "text-destructive font-semibold"
              : "text-muted-foreground"
          }
        >
          {used}
          {unlimited ? "" : ` / ${limit}`}
          {over ? " (over limit)" : ""}
        </span>
      </div>
      {!unlimited ? (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Unlimited</p>
      )}
      {href ? (
        <Link href={href} className="text-xs text-primary underline-offset-4 hover:underline">
          Manage →
        </Link>
      ) : null}
    </div>
  );
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
      redirectToBillingUrl(session.url);
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
      redirectToBillingUrl(session.url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to open billing portal";
      setActionError(message);
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-44 w-full" />
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
      <div className="flex flex-col gap-6">
        <PageHeader title="Billing" description="Manage your workspace plan and limits." />
        <SectionCard title="Billing unavailable">
          <p className="text-sm text-destructive">
            {overviewQuery.error instanceof Error
              ? overviewQuery.error.message
              : "Unable to load billing information."}
          </p>
        </SectionCard>
      </div>
    );
  }

  const org = data.organization;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Upgrade, downgrade, and manage limits for your workspace."
        actions={
          canManage && hasPaidSubscription ? (
            <Button
              variant="outline"
              disabled={portal.isPending}
              onClick={() => void handleManageSubscription()}
            >
              {portal.isPending ? "Opening…" : "Manage / cancel in Stripe"}
            </Button>
          ) : undefined
        }
      />

      {/* ── Current plan & usage ──────────────────────────────────── */}
      <SectionCard
        title="Current plan & usage"
        description="Limits are enforced when adding seats, shops, or bots."
        actions={
          <Badge variant="outline" className="text-xs">
            {org.planName}
          </Badge>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Subscription info */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subscription</span>
              <span className="font-medium">
                {formatStatus(data.subscription?.status)}
              </span>
            </div>
            {data.subscription?.currentPeriodEnd ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Renews</span>
                <span className="font-medium">
                  {new Date(
                    data.subscription.currentPeriodEnd,
                  ).toLocaleDateString()}
                </span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Daily invites</span>
              <span className="font-medium">{org.dailyInviteQuota}</span>
            </div>
          </div>

          {/* Usage bars */}
          <div className="flex flex-col gap-4">
            <UsageBar
              label="Seats"
              used={data.usage.seats}
              limit={org.seatLimit}
              href="/team"
            />
            <UsageBar
              label="Shops"
              used={data.usage.shops}
              limit={org.shopLimit}
              href="/shops"
            />
            <UsageBar
              label="Bots"
              used={data.usage.bots}
              limit={org.botLimit}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Overage warning ──────────────────────────────────────── */}
      {data.hasOverage ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span className="font-medium">Over plan limits.</span>{" "}
          {[
            data.overage.seats > 0
              ? `${data.overage.seats} seat(s) over`
              : null,
            data.overage.shops > 0
              ? `${data.overage.shops} shop(s) over`
              : null,
            data.overage.bots > 0
              ? `${data.overage.bots} bot(s) over`
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}{" "}
          — reduce usage before downgrading.
        </div>
      ) : null}

      {/* ── Upgrade / downgrade rules ─────────────────────────────── */}
      <SectionCard title="Plan change rules">
        <dl className="flex flex-col gap-3 text-sm">
          {[
            { label: "Upgrade", text: data.rules.upgrade },
            { label: "Downgrade", text: data.rules.downgrade },
            { label: "Cancel", text: data.rules.cancel },
          ].map((r) => (
            <div key={r.label} className="flex flex-col gap-0.5">
              <dt className="font-medium">{r.label}</dt>
              <dd className="text-muted-foreground">{r.text}</dd>
            </div>
          ))}
          <div>
            <dt className="font-medium">Affected by plan change</dt>
            <dd>
              <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                {data.rules.effects.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </SectionCard>

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          Only organization owners and admins can change billing.
        </p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      {/* ── Plan cards ──────────────────────────────────────────────── */}
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
