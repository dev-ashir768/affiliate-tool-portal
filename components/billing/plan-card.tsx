"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BillingPlan } from "@/types/billing";
import { cn } from "cn";

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

type PlanCardProps = {
  plan: BillingPlan;
  isCurrent: boolean;
  canManage: boolean;
  isLoading?: boolean;
  ctaLabel?: string;
  onSelect?: (planCode: string) => void;
};

export function PlanCard({
  plan,
  isCurrent,
  canManage,
  isLoading,
  ctaLabel,
  onSelect,
}: PlanCardProps) {
  const isFree = plan.code === "free";
  const showUpgrade = canManage && !isCurrent && !isFree;
  const label =
    ctaLabel ??
    (plan.trialDays > 0 ? `Start ${plan.trialDays}-day trial` : "Upgrade");

  return (
    <Card className={cn("h-full", isCurrent && "ring-2 ring-primary/40")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{plan.name}</CardTitle>
          {isCurrent ? (
            <Badge className="border-transparent bg-primary text-primary-foreground">
              Current
            </Badge>
          ) : null}
        </div>
        <CardDescription>
          <span className="text-2xl font-semibold text-foreground">
            {formatPrice(plan.monthlyPriceCents)}
          </span>
          {!isFree ? (
            <span className="text-muted-foreground"> / month</span>
          ) : null}
        </CardDescription>
        {plan.description ? (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          {plan.shopLimit} TikTok shop{plan.shopLimit === 1 ? "" : "s"}
        </p>
        <p>
          {plan.botLimit} verify bot{plan.botLimit === 1 ? "" : "s"}
        </p>
        <p>
          {plan.seatLimit} team seat{plan.seatLimit === 1 ? "" : "s"}
        </p>
        <p>{plan.dailyInviteQuota.toLocaleString()} daily invites</p>
        {plan.trialDays > 0 ? (
          <p className="font-medium text-foreground">
            {plan.trialDays}-day free trial
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        {showUpgrade ? (
          <Button
            className="w-full"
            disabled={isLoading || plan.hasStripePrice === false}
            onClick={() => onSelect?.(plan.code)}
          >
            {isLoading
              ? "Redirecting…"
              : plan.hasStripePrice === false
                ? "Unavailable"
                : label}
          </Button>
        ) : isCurrent ? (
          <Button className="w-full" variant="outline" disabled>
            Current plan
          </Button>
        ) : isFree ? (
          <Button className="w-full" variant="outline" disabled>
            Free tier
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
