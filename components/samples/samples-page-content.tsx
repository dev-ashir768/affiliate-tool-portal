"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useCreateManualSample,
  useRefreshSampleFulfillment,
  useReviewSample,
  useSamples,
  useSyncSamples,
} from "@/hooks/use-samples";
import { useCreators } from "@/hooks/use-creators";
import { useShops } from "@/hooks/use-shops";
import { createSamplesColumns } from "./samples-columns";

import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "FULFILLING", label: "Fulfilling" },
  { value: "FULFILLED", label: "Fulfilled" },
  { value: "FAILED", label: "Failed" },
];

export function SamplesPageContent() {
  const [status, setStatus] = useState("");
  const [shopId, setShopId] = useState("");
  const [manualCreatorId, setManualCreatorId] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const shopsQuery = useShops();
  const creatorsQuery = useCreators();
  const query = useSamples({
    status: status || undefined,
    shopId: shopId || undefined,
  });
  const sync = useSyncSamples();
  const review = useReviewSample();
  const refreshFulfillment = useRefreshSampleFulfillment();
  const createManual = useCreateManualSample();

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

  const selectedShopId = shopId || shopOptions[0]?.value || "";

  const creatorOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Optional creator" },
      ...(creatorsQuery.data?.creators ?? []).map((c) => ({
        value: c.id,
        label: `@${c.handle}`,
      })),
    ],
    [creatorsQuery.data?.creators],
  );

  const rows = query.data?.samples ?? [];
  const tableState = useClientDataTable({
    data: rows,
    getSearchText: (r) =>
      [r.creatorHandle, r.productTitle, r.status, r.shopName]
        .filter(Boolean)
        .join(" "),
    getSortValue: (r, id) =>
      (r as Record<string, unknown>)[id] as string | number | null | undefined,
  });

  const columns = useMemo(
    () =>
      createSamplesColumns({
        busyId,
        onApprove: (id) => {
          setBusyId(id);
          void review
            .mutateAsync({ id, action: "APPROVE" })
            .then(() => toast.success("Sample approved"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Failed"),
            )
            .finally(() => setBusyId(null));
        },
        onReject: (id) => {
          setBusyId(id);
          void review
            .mutateAsync({ id, action: "REJECT", note: "Rejected from CRM" })
            .then(() => toast.success("Sample rejected"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Failed"),
            )
            .finally(() => setBusyId(null));
        },
        onRefreshFulfillment: (id) => {
          setBusyId(id);
          void refreshFulfillment
            .mutateAsync(id)
            .then((row) => toast.success(`Fulfillment → ${row.status}`))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Failed"),
            )
            .finally(() => setBusyId(null));
        },
      }),
    [busyId, review, refreshFulfillment],
  );

  async function onSync() {
    if (!selectedShopId) {
      toast.error("Authorize a TikTok shop first");
      return;
    }
    try {
      const result = await sync.mutateAsync({
        shopId: selectedShopId,
        maxPages: 5,
      });
      toast.success(
        `Samples synced: +${result.imported} new, ${result.updated} updated`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    }
  }

  async function onManual(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShopId) {
      toast.error("Select a shop");
      return;
    }
    try {
      await createManual.mutateAsync({
        shopId: selectedShopId,
        creatorId: manualCreatorId || null,
        productTitle: productTitle.trim() || null,
      });
      setProductTitle("");
      setManualCreatorId("");
      toast.success("Sample request logged");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-14 w-full max-w-md" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sample requests"
        description="Sync TikTok free-sample applications, then approve / reject and track fulfillment."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Sync from TikTok"
          description="Pull sample applications for a shop and filter by status."
        >
          <div className="flex h-full flex-col gap-4">
            <FormGrid columns={2}>
              <Field>
                <FieldLabel>Shop</FieldLabel>
                <AppReactSelect
                  options={shopOptions}
                  value={stringSelectValue(shopOptions, selectedShopId)}
                  onChange={(opt) =>
                    setShopId(opt?.value ? String(opt.value) : "")
                  }
                  isDisabled={oauthShops.length === 0}
                  isSearchable={oauthShops.length > 8}
                  aria-label="Shop"
                />
              </Field>
              <Field>
                <FieldLabel>Status</FieldLabel>
                <AppReactSelect
                  options={STATUS_OPTIONS}
                  value={stringSelectValue(STATUS_OPTIONS, status)}
                  onChange={(opt) =>
                    setStatus(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable={false}
                  aria-label="Status filter"
                />
              </Field>
            </FormGrid>
            <Button
              type="button"
              size="lg"
              className="mt-auto self-end"
              disabled={!selectedShopId || sync.isPending}
              onClick={() => void onSync()}
            >
              {sync.isPending ? "Syncing…" : "Sync from TikTok"}
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Log manual request"
          description="Track a sample request made outside TikTok."
        >
          <form
            onSubmit={(e) => void onManual(e)}
            className="flex h-full flex-col gap-4"
          >
            <FormGrid columns={2}>
              <Field>
                <FieldLabel htmlFor="sample-product">Product title</FieldLabel>
                <Input
                  id="sample-product"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Optional"
                />
              </Field>
              <Field>
                <FieldLabel>Creator</FieldLabel>
                <AppReactSelect
                  options={creatorOptions}
                  value={stringSelectValue(creatorOptions, manualCreatorId)}
                  onChange={(opt) =>
                    setManualCreatorId(opt?.value ? String(opt.value) : "")
                  }
                  isSearchable
                  aria-label="Creator"
                />
              </Field>
            </FormGrid>
            <Button
              type="submit"
              size="lg"
              className="mt-auto self-end"
              disabled={createManual.isPending}
            >
              Log manual request
            </Button>
          </form>
        </SectionCard>
      </div>

      {query.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load samples"}
        </p>
      ) : null}

      <DataTable
        tableId="dashboard-samples"
        columns={columns}
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
        ariaLabel="Sample requests"
      />
    </div>
  );
}
