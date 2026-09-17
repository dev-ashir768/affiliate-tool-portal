"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { ConnectShopDialog } from "@/components/shops/connect-shop-dialog";
import { ShopsTable } from "@/components/shops/shops-table";
import { useMe } from "@/hooks/use-me";
import { useOrg } from "@/hooks/use-org";
import {
  useDisconnectShop,
  useShops,
  useVerifyShop,
} from "@/hooks/use-shops";
import type { ShopStatus } from "@/types/shops";

export function ShopsPageContent() {
  const meQuery = useMe();
  const orgQuery = useOrg();
  const shopsQuery = useShops();
  const verify = useVerifyShop();
  const disconnect = useDisconnectShop();
  const [actionError, setActionError] = useState<string | null>(null);
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);
  const prevStatus = useRef<Record<string, ShopStatus>>({});

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
  const shopLimit = orgQuery.data?.shopLimit ?? 0;
  const shops = shopsQuery.data?.shops ?? [];
  const activeCount = shops.filter((s) => s.status !== "DISCONNECTED").length;
  const atLimit = shopLimit > 0 && activeCount >= shopLimit;
  const zeroLimit = shopLimit === 0;

  const isLoading =
    meQuery.isLoading || orgQuery.isLoading || shopsQuery.isLoading;

  useEffect(() => {
    for (const shop of shops) {
      const prev = prevStatus.current[shop.id];
      if (prev === "VERIFYING" && shop.status === "ACTIVE") {
        toast.success(
          `${shop.displayName ?? shop.botEmail ?? "Shop"} verified`,
        );
      }
      if (prev === "VERIFYING" && shop.status === "FAILED") {
        toast.error(shop.statusReason ?? "Shop verification failed");
      }
      prevStatus.current[shop.id] = shop.status;
    }
  }, [shops]);

  async function handleVerify(id: string) {
    setActionError(null);
    try {
      await verify.mutateAsync(id);
      toast.message("Verification started");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start verification";
      setActionError(message);
      toast.error(message);
    }
  }

  async function handleDisconnect(id: string) {
    setActionError(null);
    try {
      await disconnect.mutateAsync(id);
      toast.success("Shop disconnected");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to disconnect shop";
      setActionError(message);
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (shopsQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shops unavailable</CardTitle>
          <CardDescription>
            {shopsQuery.error instanceof Error
              ? shopsQuery.error.message
              : "Unable to load shops."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Shops</h1>
          <p className="text-sm text-muted-foreground">
            Connect and verify TikTok Shop accounts for your organization.
            {orgQuery.data ? (
              <>
                {" "}
                Using {activeCount} of {shopLimit} shop
                {shopLimit === 1 ? "" : "s"}.
              </>
            ) : null}
          </p>
        </div>
        {canManage ? (
          <ConnectShopDialog
            disabled={atLimit || zeroLimit}
            disabledReason={
              zeroLimit
                ? "Your plan does not include connected shops."
                : atLimit
                  ? "You have reached your shop limit."
                  : null
            }
            onPlanLimit={() => setShowUpgradeHint(true)}
          />
        ) : null}
      </div>

      {!canManage ? (
        <p className="text-sm text-muted-foreground">
          Only organization owners and admins can connect or verify shops.
        </p>
      ) : null}

      {(zeroLimit || atLimit || showUpgradeHint) && canManage ? (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            {zeroLimit
              ? "Upgrade your plan to connect shops."
              : "Shop limit reached. Upgrade to connect more shops."}{" "}
            <Link
              href="/billing"
              className={buttonVariants({
                variant: "link",
                className: "h-auto p-0",
              })}
            >
              View billing
            </Link>
          </p>
        </div>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <ShopsTable
        shops={shops}
        canManage={canManage}
        verifyingId={verify.isPending ? (verify.variables ?? null) : null}
        disconnectingId={
          disconnect.isPending ? (disconnect.variables ?? null) : null
        }
        onVerify={handleVerify}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
