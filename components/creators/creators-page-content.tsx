"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  useAddCreatorToList,
  useCreateCreator,
  useCreateCreatorList,
  useCreatorLists,
  useCreators,
  useDeleteCreator,
  usePatchCreator,
} from "@/hooks/use-creators";
import {
  useOrgDiscoveryTikTokStatus,
  useRefreshOrgCrmCreatorMetrics,
} from "@/hooks/use-commerce";
import type { CreatorStage } from "@/types/creators";
import { createCreatorsColumns, listsToOptions } from "./creators-columns";

import { Field, FieldLabel } from "@/components/ui/field";
import { PageHeader } from "@/components/layout/page-header";
import { FormGrid, SectionCard } from "@/components/layout/section-card";
const STAGES: CreatorStage[] = [
  "LEAD",
  "CONTACTED",
  "INVITED",
  "ACTIVE",
  "REJECTED",
];

const STAGE_OPTIONS: SelectOption[] = STAGES.map((s) => ({
  value: s,
  label: s,
}));

export function CreatorsPageContent() {
  const creatorsQuery = useCreators();
  const listsQuery = useCreatorLists();
  const create = useCreateCreator();
  const patch = usePatchCreator();
  const remove = useDeleteCreator();
  const createList = useCreateCreatorList();
  const addToList = useAddCreatorToList();
  const tiktok = useOrgDiscoveryTikTokStatus();
  const refreshMetrics = useRefreshOrgCrmCreatorMetrics();
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [listName, setListName] = useState("");
  const [shopId, setShopId] = useState("");

  const oauthShops = useMemo(
    () => (tiktok.data?.shops ?? []).filter((s) => s.oauthConnected),
    [tiktok.data?.shops],
  );
  const shopOptions: SelectOption[] = useMemo(
    () =>
      oauthShops.map((s) => ({
        value: s.id,
        label: s.displayName ?? s.externalShopId ?? s.id,
      })),
    [oauthShops],
  );
  const selectedShopId = shopId || shopOptions[0]?.value || "";

  const creators = creatorsQuery.data?.creators ?? [];
  const lists = useMemo(
    () => listsQuery.data?.lists ?? [],
    [listsQuery.data?.lists],
  );
  const listOptions = useMemo(() => listsToOptions(lists), [lists]);

  const tableState = useClientDataTable({
    data: creators,
    getSearchText: (c) =>
      [
        c.handle,
        c.displayName,
        c.contactEmail,
        c.stage,
        c.gmvRange,
        c.gmvAmount,
      ]
        .filter(Boolean)
        .join(" "),
    getSortValue: (c, id) => {
      if (id === "gmv") return c.gmvAmount ?? c.gmvRange ?? "";
      return (c as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });

  const columns = useMemo(
    () =>
      createCreatorsColumns({
        stageOptions: STAGE_OPTIONS,
        listOptions,
        onStageChange: (id, stage) => {
          void patch
            .mutateAsync({ id, body: { stage } })
            .then(() => toast.success("Stage updated"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Update failed"),
            );
        },
        onAddToList: (creatorId, listId) => {
          void addToList
            .mutateAsync({ listId, creatorId })
            .then(() => toast.success("Added to list"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Add failed"),
            );
        },
        onRemove: (id) => {
          void remove
            .mutateAsync(id)
            .then(() => toast.success("Removed"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Delete failed"),
            );
        },
        removePending: remove.isPending,
      }),
    [addToList, listOptions, patch, remove],
  );

  async function onAddCreator(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    try {
      await create.mutateAsync({
        handle: handle.trim(),
        contactEmail: email.trim() || null,
      });
      setHandle("");
      setEmail("");
      toast.success("Creator added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  }

  async function onAddList(e: React.FormEvent) {
    e.preventDefault();
    if (!listName.trim()) return;
    try {
      await createList.mutateAsync({ name: listName.trim() });
      setListName("");
      toast.success("List created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create list");
    }
  }

  async function onRefreshMetrics() {
    if (!selectedShopId) {
      toast.error("Authorize a TikTok shop first");
      return;
    }
    try {
      const result = await refreshMetrics.mutateAsync({
        shopId: selectedShopId,
        limit: 50,
        sync: false,
      });
      if ("jobId" in result) {
        toast.success(`Metrics refresh queued (${result.jobId})`);
      } else {
        toast.success(
          `Refreshed ${result.refreshed}, skipped ${result.skipped}, failed ${result.failed}`,
        );
        void creatorsQuery.refetch();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Refresh failed");
    }
  }

  if (creatorsQuery.isLoading) {
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
        title="Creators"
        description="CRM for TikTok Shop creators. Followers / GMV refresh from TikTok when you re-sync discovery or run Refresh metrics."
        actions={
          shopOptions.length > 0 ? (
            <>
              <AppReactSelect
                className="w-52"
                options={shopOptions}
                value={stringSelectValue(shopOptions, selectedShopId)}
                onChange={(opt) =>
                  setShopId(opt?.value ? String(opt.value) : "")
                }
                placeholder="Shop"
                isSearchable
                aria-label="Shop for metrics refresh"
              />
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={refreshMetrics.isPending}
                onClick={() => void onRefreshMetrics()}
              >
                {refreshMetrics.isPending ? "Queuing…" : "Refresh metrics"}
              </Button>
            </>
          ) : (
            <Link
              href="/shops"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Connect shop to refresh
            </Link>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Add creator"
          description="Add a TikTok creator to your CRM by handle."
        >
          <form
            onSubmit={(e) => void onAddCreator(e)}
            className="flex h-full flex-col gap-4"
          >
            <FormGrid columns={2}>
              <Field>
                <FieldLabel htmlFor="creator-handle">Handle</FieldLabel>
                <Input
                  id="creator-handle"
                  placeholder="@creator"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="creator-email">Contact email</FieldLabel>
                <Input
                  id="creator-email"
                  type="email"
                  placeholder="Optional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </FormGrid>
            <Button
              type="submit"
              size="lg"
              className="mt-auto self-end"
              disabled={create.isPending}
            >
              {create.isPending ? "Adding…" : "Add creator"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          title="Lists"
          description="Group creators for campaigns, outreach and invites."
        >
          <div className="flex h-full flex-col gap-4">
            <form
              onSubmit={(e) => void onAddList(e)}
              className="flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <Field className="flex-1">
                <FieldLabel htmlFor="list-name">New list</FieldLabel>
                <Input
                  id="list-name"
                  placeholder="List name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </Field>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={createList.isPending}
              >
                Create list
              </Button>
            </form>
            {lists.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lists yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lists.map((l) => (
                  <Badge
                    key={l.id}
                    variant="outline"
                    className="h-7 rounded-md px-2.5"
                  >
                    {l.name} · {l.memberCount}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {creatorsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {creatorsQuery.error instanceof Error
            ? creatorsQuery.error.message
            : "Unable to load creators"}
        </p>
      ) : null}

      <DataTable
        tableId="dashboard-creators"
        columns={columns}
        data={tableState.data}
        totalCount={tableState.totalCount}
        pagination={tableState.pagination}
        onPaginationChange={tableState.onPaginationChange}
        sorting={tableState.sorting}
        onSortingChange={tableState.onSortingChange}
        search={tableState.search}
        onSearchChange={tableState.onSearchChange}
        isLoading={creatorsQuery.isLoading}
        isFetching={creatorsQuery.isFetching}
        isError={creatorsQuery.isError}
        onRetry={() => void creatorsQuery.refetch()}
        onRefresh={() => void creatorsQuery.refetch()}
        enableColumnOrdering
        pageSizeOptions={[10, 20, 50]}
        getRowId={(row) => row.id}
        ariaLabel="Creators"
      />
    </div>
  );
}
