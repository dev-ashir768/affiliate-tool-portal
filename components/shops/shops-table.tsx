"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shop, ShopStatus } from "@/types/shops";
import { cn } from "cn";

function statusBadgeClass(status: ShopStatus) {
  if (status === "ACTIVE") {
    return "border-transparent bg-primary text-primary-foreground";
  }
  if (status === "VERIFYING" || status === "PENDING_INVITE") {
    return "border-transparent bg-foreground text-background";
  }
  if (status === "FAILED") {
    return "border-transparent bg-destructive text-destructive-foreground";
  }
  return "border-border bg-transparent text-muted-foreground";
}

function formatStatus(status: ShopStatus) {
  return status.replace(/_/g, " ").toLowerCase();
}

type ShopsTableProps = {
  shops: Shop[];
  canManage: boolean;
  verifyingId: string | null;
  disconnectingId: string | null;
  authorizingId: string | null;
  onVerify: (id: string) => Promise<void>;
  onAuthorizeTikTok: (id: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
};

export function ShopsTable({
  shops,
  canManage,
  verifyingId,
  disconnectingId,
  authorizingId,
  onVerify,
  onAuthorizeTikTok,
  onDisconnect,
}: ShopsTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (shops.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        No shops connected yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shop</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>API</TableHead>
            <TableHead>Bot email</TableHead>
            <TableHead>Status</TableHead>
            {canManage ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop) => {
            const canVerify =
              Boolean(shop.botEmail) &&
              (shop.status === "PENDING_INVITE" || shop.status === "FAILED");
            const canAuthorize = !shop.oauthConnected && shop.status !== "DISCONNECTED";
            const canDisconnect = shop.status !== "DISCONNECTED";
            const isConfirming = confirmId === shop.id;

            return (
              <TableRow key={shop.id}>
                <TableCell>
                  <div className="font-medium">
                    {shop.displayName ?? shop.externalShopId ?? "Unnamed shop"}
                  </div>
                  {shop.statusReason ? (
                    <p
                      className="mt-0.5 max-w-sm whitespace-normal break-words text-xs text-muted-foreground"
                      title={shop.statusReason}
                    >
                      {shop.statusReason}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>{shop.region}</TableCell>
                <TableCell>
                  {shop.oauthConnected ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-transparent bg-primary px-2.5 py-0.5 text-primary-foreground"
                    >
                      OAuth
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not linked</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {shop.botEmail ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-medium capitalize",
                      statusBadgeClass(shop.status),
                    )}
                  >
                    {formatStatus(shop.status)}
                  </Badge>
                </TableCell>
                {canManage ? (
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {canAuthorize ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={authorizingId === shop.id}
                          onClick={() => void onAuthorizeTikTok(shop.id)}
                        >
                          {authorizingId === shop.id
                            ? "Opening…"
                            : "Authorize TikTok"}
                        </Button>
                      ) : null}
                      {canVerify ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={verifyingId === shop.id}
                          onClick={() => void onVerify(shop.id)}
                        >
                          {verifyingId === shop.id ? "Starting…" : "Verify"}
                        </Button>
                      ) : null}
                      {shop.status === "VERIFYING" ? (
                        <span className="text-xs text-muted-foreground">
                          Verifying…
                        </span>
                      ) : null}
                      {canDisconnect ? (
                        isConfirming ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={disconnectingId === shop.id}
                              onClick={() => void onDisconnect(shop.id)}
                            >
                              {disconnectingId === shop.id
                                ? "Disconnecting…"
                                : "Confirm"}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setConfirmId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmId(shop.id)}
                          >
                            Disconnect
                          </Button>
                        )
                      ) : null}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
