"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePatchPlatformPlan,
  usePlatformPlans,
} from "@/hooks/use-platform";
import type { PlatformPlan } from "@/types/billing";
import type { PatchPlatformPlanSchemaType } from "@/validations/platform.validations";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function PlanEditor({ plan }: { plan: PlatformPlan }) {
  const patch = usePatchPlatformPlan();
  const [form, setForm] = useState({
    name: plan.name,
    description: plan.description ?? "",
    monthlyPriceCents: String(plan.monthlyPriceCents),
    seatLimit: String(plan.seatLimit),
    shopLimit: String(plan.shopLimit),
    botLimit: String(plan.botLimit),
    dailyInviteQuota: String(plan.dailyInviteQuota),
    trialDays: String(plan.trialDays),
    stripePriceId: plan.stripePriceId ?? "",
    sortOrder: String(plan.sortOrder),
    isPublic: plan.isPublic,
    active: plan.active,
  });

  async function onSave() {
    const body: PatchPlatformPlanSchemaType = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      monthlyPriceCents: Number(form.monthlyPriceCents),
      seatLimit: Number(form.seatLimit),
      shopLimit: Number(form.shopLimit),
      botLimit: Number(form.botLimit),
      dailyInviteQuota: Number(form.dailyInviteQuota),
      trialDays: Number(form.trialDays),
      stripePriceId: form.stripePriceId.trim() || null,
      sortOrder: Number(form.sortOrder),
      isPublic: form.isPublic,
      active: form.active,
    };
    try {
      await patch.mutateAsync({ id: plan.id, body });
      toast.success(`Saved ${plan.code}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save plan");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="capitalize">{plan.code}</CardTitle>
            <CardDescription>
              Catalog price {formatMoney(plan.monthlyPriceCents)}/mo · set Stripe
              price id after creating the Price in Stripe Dashboard
            </CardDescription>
          </div>
          <Button disabled={patch.isPending} onClick={() => void onSave()}>
            {patch.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-name`}>Display name</Label>
          <Input
            id={`${plan.id}-name`}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${plan.id}-desc`}>Description</Label>
          <Input
            id={`${plan.id}-desc`}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-price`}>Monthly price (cents)</Label>
          <Input
            id={`${plan.id}-price`}
            inputMode="numeric"
            value={form.monthlyPriceCents}
            onChange={(e) =>
              setForm((f) => ({ ...f, monthlyPriceCents: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-shops`}>Shop limit</Label>
          <Input
            id={`${plan.id}-shops`}
            inputMode="numeric"
            value={form.shopLimit}
            onChange={(e) =>
              setForm((f) => ({ ...f, shopLimit: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-bots`}>Bot limit</Label>
          <Input
            id={`${plan.id}-bots`}
            inputMode="numeric"
            value={form.botLimit}
            onChange={(e) =>
              setForm((f) => ({ ...f, botLimit: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-seats`}>Seat limit</Label>
          <Input
            id={`${plan.id}-seats`}
            inputMode="numeric"
            value={form.seatLimit}
            onChange={(e) =>
              setForm((f) => ({ ...f, seatLimit: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-invites`}>Daily invite quota</Label>
          <Input
            id={`${plan.id}-invites`}
            inputMode="numeric"
            value={form.dailyInviteQuota}
            onChange={(e) =>
              setForm((f) => ({ ...f, dailyInviteQuota: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-trial`}>Trial days</Label>
          <Input
            id={`${plan.id}-trial`}
            inputMode="numeric"
            value={form.trialDays}
            onChange={(e) =>
              setForm((f) => ({ ...f, trialDays: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${plan.id}-sort`}>Sort order</Label>
          <Input
            id={`${plan.id}-sort`}
            inputMode="numeric"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
          <Label htmlFor={`${plan.id}-stripe`}>Stripe price id</Label>
          <Input
            id={`${plan.id}-stripe`}
            placeholder="price_..."
            value={form.stripePriceId}
            onChange={(e) =>
              setForm((f) => ({ ...f, stripePriceId: e.target.value }))
            }
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) =>
              setForm((f) => ({ ...f, isPublic: e.target.checked }))
            }
          />
          Public (shown at checkout)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.target.checked }))
            }
          />
          Active
        </label>
      </CardContent>
    </Card>
  );
}

export function PlansAdminPage() {
  const query = usePlatformPlans();

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plans unavailable</CardTitle>
          <CardDescription>
            {query.error instanceof Error
              ? query.error.message
              : "Unable to load subscription plans."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const plans = [...query.data.plans].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.monthlyPriceCents - b.monthlyPriceCents,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Plans</h1>
        <p className="text-sm text-muted-foreground">
          Edit catalog pricing, limits, and trial length. Changing cents here
          updates display; Stripe charges use the linked Stripe price id.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <PlanEditor key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
