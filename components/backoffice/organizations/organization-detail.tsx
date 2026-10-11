"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useImpersonatePlatformUser,
  usePlatformOrganization,
  useRevokePlatformOrganizationAccess,
} from "@/hooks/use-platform";
import { GrantAccessDialog } from "@/components/backoffice/organizations/grant-access-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMe } from "@/hooks/use-me";
import { useAdminResetTwoFactor } from "@/hooks/use-two-factor";

function MemberResetTwoFactor({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) {
  const resetTwoFactor = useAdminResetTwoFactor();
  const [open, setOpen] = useState(false);

  async function confirmReset() {
    try {
      await resetTwoFactor.mutateAsync(userId);
      toast.success(`2FA reset for ${email}`);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset 2FA");
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Reset 2FA
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!resetTwoFactor.isPending) setOpen(next);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset two-factor authentication?</DialogTitle>
            <DialogDescription>
              {name} ({email}) will lose their authenticator, backup codes, and
              trusted devices, and must set up 2FA again on next sign-in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={resetTwoFactor.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={resetTwoFactor.isPending}
              onClick={() => void confirmReset()}
            >
              {resetTwoFactor.isPending ? "Resetting…" : "Reset 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function OrganizationDetail({ id }: { id: string }) {
  const query = usePlatformOrganization(id);
  const revoke = useRevokePlatformOrganizationAccess();
  const impersonate = useImpersonatePlatformUser();
  const meQuery = useMe();
  const isSuperadmin = meQuery.data?.platformMembership?.role === "SUPERADMIN";

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
  const billingSource = org.billingSource ?? "none";

  async function handleRevokeAccess() {
    if (
      !window.confirm(
        "Revoke complimentary access for this organization? They will lose product access when the change applies.",
      )
    ) {
      return;
    }
    try {
      await revoke.mutateAsync({ id, body: {} });
      toast.success("Complimentary access revoked");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to revoke access",
      );
    }
  }

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
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                {billingSource === "manual"
                  ? "Complimentary access is managed by the platform team."
                  : "Invoices and payment methods are managed in Stripe. Merchants open Customer Portal from /billing."}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                Billing source: {billingSource}
              </Badge>
              {billingSource !== "stripe" ? (
                <GrantAccessDialog organizationId={id} />
              ) : null}
              {billingSource === "manual" ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={revoke.isPending}
                  onClick={() => void handleRevokeAccess()}
                >
                  {revoke.isPending ? "Revoking…" : "Revoke access"}
                </Button>
              ) : null}
            </div>
          </div>
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
            {billingSource === "stripe" && org.stripeSubscriptionId ? (
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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-muted-foreground">
                    {m.role} · {m.status}
                  </p>
                  {isSuperadmin ? (
                    <MemberResetTwoFactor
                      userId={m.user.id}
                      name={m.user.name}
                      email={m.user.email}
                    />
                  ) : null}
                  {m.status === "ACTIVE" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={impersonate.isPending}
                      onClick={() => {
                        impersonate.mutate(
                          { userId: m.user.id, organizationId: id },
                          {
                            onSuccess: (data) => {
                              toast.success(`Viewing as ${data.user.email}`);
                              window.location.assign(data.redirectTo);
                            },
                            onError: (err) => {
                              toast.error(
                                err instanceof Error
                                  ? err.message
                                  : "Impersonation failed",
                              );
                            },
                          },
                        );
                      }}
                    >
                      View as user
                    </Button>
                  ) : null}
                </div>
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
