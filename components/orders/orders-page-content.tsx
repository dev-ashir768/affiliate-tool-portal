"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateOrder, useOrders } from "@/hooks/use-commerce";
import { useCreators } from "@/hooks/use-creators";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function OrdersPageContent() {
  const query = useOrders();
  const creators = useCreators();
  const create = useCreateOrder();
  const [externalOrderId, setExternalOrderId] = useState("");
  const [gmv, setGmv] = useState("");
  const [commission, setCommission] = useState("");
  const [creatorId, setCreatorId] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const gmvCents = Math.round(Number(gmv) * 100);
    if (!externalOrderId.trim() || !Number.isFinite(gmvCents) || gmvCents < 0) {
      toast.error("Order id and GMV required");
      return;
    }
    try {
      await create.mutateAsync({
        externalOrderId: externalOrderId.trim(),
        gmvCents,
        status: "PAID",
        orderedAt: new Date().toISOString(),
        creatorId: creatorId || null,
        commissionCents: commission
          ? Math.round(Number(commission) * 100)
          : undefined,
      });
      setExternalOrderId("");
      setGmv("");
      setCommission("");
      setCreatorId("");
      toast.success("Order recorded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  const orders = query.data?.orders ?? [];
  const creatorRows = creators.data?.creators ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Record affiliate orders and commissions attributed to creators.
        </p>
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          placeholder="External order id"
          value={externalOrderId}
          onChange={(e) => setExternalOrderId(e.target.value)}
        />
        <Input
          placeholder="GMV (e.g. 49.99)"
          value={gmv}
          onChange={(e) => setGmv(e.target.value)}
        />
        <Input
          placeholder="Commission (optional)"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />
        <select
          className="rounded-md border border-border bg-background px-2 py-2 text-sm"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
        >
          <option value="">Creator (optional)</option>
          {creatorRows.map((c) => (
            <option key={c.id} value={c.id}>
              @{c.handle}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Saving…" : "Add order"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Creator</th>
              <th className="px-3 py-2 font-medium">GMV</th>
              <th className="px-3 py-2 font-medium">Commission</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">
                    {o.externalOrderId}
                  </td>
                  <td className="px-3 py-2">
                    {o.creatorHandle ? `@${o.creatorHandle}` : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {formatMoney(o.gmvCents, o.currency)}
                  </td>
                  <td className="px-3 py-2">
                    {formatMoney(o.commissionCents, o.currency)}
                  </td>
                  <td className="px-3 py-2">{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
