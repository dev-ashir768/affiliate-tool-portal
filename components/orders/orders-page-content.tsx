"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useCreateOrder,
  useOrders,
  useSyncAffiliateOrders,
} from "@/hooks/use-commerce";
import { useCreators } from "@/hooks/use-creators";
import { useShops } from "@/hooks/use-shops";
import { ordersColumns } from "./orders-columns";

export function OrdersPageContent() {
  const query = useOrders();
  const creators = useCreators();
  const shopsQuery = useShops();
  const create = useCreateOrder();
  const syncOrders = useSyncAffiliateOrders();
  const [externalOrderId, setExternalOrderId] = useState("");
  const [gmv, setGmv] = useState("");
  const [commission, setCommission] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [syncShopId, setSyncShopId] = useState("");

  const oauthShops = useMemo(
    () =>
      (shopsQuery.data?.shops ?? []).filter((s) => Boolean(s.oauthConnected)),
    [shopsQuery.data?.shops],
  );

  const shopOptions: SelectOption[] = useMemo(() => {
    if (oauthShops.length === 0) {
      return [{ value: "", label: "No OAuth shop" }];
    }
    return oauthShops.map((s) => ({
      value: s.id,
      label: `${s.displayName || s.id} (${s.region})`,
    }));
  }, [oauthShops]);

  const selectedSyncShopId = syncShopId || shopOptions[0]?.value || "";

  const creatorOptions: SelectOption[] = useMemo(
    () =>
      (creators.data?.creators ?? []).map((c) => ({
        value: c.id,
        label: `@${c.handle}`,
      })),
    [creators.data?.creators],
  );

  const orders = query.data?.orders ?? [];
  const tableState = useClientDataTable({
    data: orders,
    getSearchText: (o) =>
      [o.externalOrderId, o.creatorHandle, o.status]
        .filter(Boolean)
        .join(" "),
    getSortValue: (o, id) =>
      (o as Record<string, unknown>)[id] as string | number | null | undefined,
  });

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

  async function onSync() {
    if (!selectedSyncShopId) {
      toast.error("Authorize a TikTok shop first");
      return;
    }
    try {
      const result = await syncOrders.mutateAsync({
        shopId: selectedSyncShopId,
        lookbackDays: 30,
        maxPages: 5,
      });
      toast.success(
        `Synced orders: +${result.imported} new, ${result.updated} updated, ${result.skipped} skipped (${result.pages} pages)`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    }
  }

  if (query.isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Sync affiliate-attributed orders from TikTok, or record them manually.
        </p>
      </div>

      <section className="flex flex-wrap items-end gap-2 rounded-xl border border-border p-4">
        <div className="min-w-[12rem] space-y-1">
          <label className="text-xs text-muted-foreground">Shop</label>
          <AppReactSelect
            className="min-w-48"
            options={shopOptions}
            value={stringSelectValue(shopOptions, selectedSyncShopId)}
            onChange={(opt) =>
              setSyncShopId(opt?.value ? String(opt.value) : "")
            }
            isDisabled={oauthShops.length === 0}
            isSearchable={oauthShops.length > 8}
            aria-label="Shop for order sync"
          />
        </div>
        <Button
          type="button"
          disabled={!selectedSyncShopId || syncOrders.isPending}
          onClick={() => void onSync()}
        >
          {syncOrders.isPending ? "Syncing…" : "Sync TikTok affiliate orders"}
        </Button>
      </section>

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
        <AppReactSelect
          options={[
            { value: "", label: "No creator" },
            ...creatorOptions,
          ]}
          value={stringSelectValue(
            [{ value: "", label: "No creator" }, ...creatorOptions],
            creatorId,
          )}
          onChange={(opt) => setCreatorId(opt?.value ? String(opt.value) : "")}
          isSearchable
          aria-label="Creator"
        />
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Saving…" : "Add manual order"}
        </Button>
      </form>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load orders"}
        </p>
      ) : null}

      <DataTable
        tableId="dashboard-orders"
        columns={ordersColumns}
        data={tableState.data}
        totalCount={tableState.totalCount}
        pagination={tableState.pagination}
        onPaginationChange={tableState.onPaginationChange}
        sorting={tableState.sorting}
        onSortingChange={tableState.onSortingChange}
        search={tableState.search}
        onSearchChange={tableState.onSearchChange}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        enableColumnOrdering
        pageSizeOptions={[10, 20, 50]}
        getRowId={(row) => row.id}
        ariaLabel="Orders"
      />
    </div>
  );
}
