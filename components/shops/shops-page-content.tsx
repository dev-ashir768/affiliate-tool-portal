"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import type { ShopStatus } from "@/types/shops";
import { ConnectShopDialog } from "@/components/shops/connect-shop-dialog";
import { ShopsTable } from "@/components/shops/shops-table";
import { useMe } from "@/hooks/use-me";
import { useOrg } from "@/hooks/use-org";
import {
  useDisconnectShop,
  useShops,
  useStartTikTokOAuth,
  useTikTokOAuthStatus,
  useVerifyShop,
} from "@/hooks/use-shops";

import { PageHeader } from "@/components/layout/page-header";

export function ShopsPageContent() {
  const meQuery = useMe();
  const orgQuery = useOrg();
  const shopsQuery = useShops();
  const oauthStatus = useTikTokOAuthStatus();
  const verify = useVerifyShop();
  const disconnect = useDisconnectShop();
  const startOauth = useStartTikTokOAuth();
  const searchParams = useSearchParams();
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
  const shops = useMemo(
    () => shopsQuery.data?.shops ?? [],
    [shopsQuery.data?.shops],
  );
  const activeCount = shops.filter((s) => s.status !== "DISCONNECTED").length;
  const atLimit = shopLimit > 0 && activeCount >= shopLimit;
  const zeroLimit = shopLimit === 0;

  const isLoading =
    meQuery.isLoading || orgQuery.isLoading || shopsQuery.isLoading;

  useEffect(() => {
    if (searchParams.get("oauth") === "connected") {
      toast.success("TikTok Shop authorized");
      void shopsQuery.refetch();
    }
  }, [searchParams, shopsQuery]);

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

  async function handleAuthorize(id: string) {
    setActionError(null);
    try {
      const shop = shops.find((s) => s.id === id);
      const result = await startOauth.mutateAsync({
        region: shop?.region ?? "US",
        shopId: id,
      });
      window.location.href = result.authorizeUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start TikTok OAuth";
      setActionError(message);
      toast.error(message);
    }
  }

  async function handleOauthConnectNew(region: "US" | "UK") {
    try {
      const result = await startOauth.mutateAsync({ region, shopId: null });
      window.location.href = result.authorizeUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start TikTok OAuth";
      toast.error(message);
      if (message.toLowerCase().includes("shop limit")) {
        setShowUpgradeHint(true);
      }
      throw err;
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

  const oauthReady = oauthStatus.data?.configured === true;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shops"
        description={
          <>
            Authorize your TikTok Shop (OpenAPI) so influxa can discover
            creators for your niche. Bot verify remains optional for
            collaborator sessions.
            {orgQuery.data ? (
              <>
                {" "}
                Using {activeCount} of {shopLimit} shop
                {shopLimit === 1 ? "" : "s"}.
              </>
            ) : null}
          </>
        }
        actions={
          canManage ? (
            <ConnectShopDialog
              disabled={atLimit || zeroLimit}
              disabledReason={
                zeroLimit
                  ? "Your plan does not include connected shops."
                  : atLimit
                    ? "You have reached your shop limit."
                    : null
              }
              oauthAvailable={oauthReady}
              oauthPending={startOauth.isPending}
              onOauthConnect={handleOauthConnectNew}
              onPlanLimit={() => setShowUpgradeHint(true)}
            />
          ) : undefined
        }
      />

      {canManage && oauthStatus.data && !oauthReady ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            TikTok authorization is coming soon.
          </span>{" "}
          You can connect your shop now with a bot collaborator — click
          Connect shop and choose the bot option.
        </div>
      ) : null}

      {!canManage ? (
        <div className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          Only organization owners and admins can connect or verify shops.
        </div>
      ) : null}

      {(zeroLimit || atLimit || showUpgradeHint) && canManage ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            {zeroLimit
              ? "Upgrade your plan to connect shops."
              : "Shop limit reached. Upgrade to connect more shops."}
          </span>
          <Link
            href="/billing"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View billing
          </Link>
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
        authorizingId={
          startOauth.isPending
            ? ((startOauth.variables?.shopId as string | null | undefined) ??
              "__new__")
            : null
        }
        oauthAvailable={oauthReady}
        onVerify={handleVerify}
        onAuthorizeTikTok={handleAuthorize}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
