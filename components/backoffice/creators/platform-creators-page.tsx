"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import {
  usePatchPlatformCreator,
  usePlatformCreators,
  usePlatformOrganizations,
} from "@/hooks/use-platform";
import { AddPlatformCreatorDialog } from "@/components/backoffice/creators/add-platform-creator-dialog";
import { createPlatformCreatorsColumns } from "./platform-creators-columns";

const STAGES = ["LEAD", "CONTACTED", "INVITED", "ACTIVE", "REJECTED"] as const;

const STAGE_OPTIONS: SelectOption[] = STAGES.map((s) => ({
  value: s,
  label: s,
}));

export function PlatformCreatorsPageContent() {
  const orgsQuery = usePlatformOrganizations({
    page: 1,
    pageSize: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
  const [orgFilter, setOrgFilter] = useState("");
  const [search, setSearch] = useState("");
  const creatorsQuery = usePlatformCreators({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    organizationId: orgFilter || undefined,
  });
  const patch = usePatchPlatformCreator();

  const orgs = orgsQuery.data?.data;
  const creators = creatorsQuery.data?.data ?? [];

  const orgOptions: SelectOption[] = useMemo(
    () =>
      (orgs ?? []).map((o) => ({
        value: o.id,
        label: `${o.name} (${o.slug})`,
      })),
    [orgs],
  );

  const orgFilterOptions: SelectOption[] = useMemo(
    () => [{ value: "", label: "All organizations" }, ...orgOptions],
    [orgOptions],
  );

  const tableState = useClientDataTable({
    data: creators,
    getSortValue: (c, id) => {
      if (id === "organization") return c.organization.name;
      return (c as Record<string, unknown>)[id] as
        | string
        | number
        | null
        | undefined;
    },
  });

  const columns = useMemo(
    () =>
      createPlatformCreatorsColumns({
        stageOptions: STAGE_OPTIONS,
        onStageChange: (id, stage) => {
          void patch
            .mutateAsync({ id, body: { stage } })
            .then(() => toast.success("Stage updated"))
            .catch((err) =>
              toast.error(err instanceof Error ? err.message : "Update failed"),
            );
        },
      }),
    [patch],
  );

  const toolbarFilters = (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Organization</p>
      <AppReactSelect
        portalMenu
        options={orgFilterOptions}
        value={stringSelectValue(orgFilterOptions, orgFilter)}
        onChange={(opt) => setOrgFilter(opt?.value ? String(opt.value) : "")}
        isSearchable
        aria-label="Filter by organization"
      />
    </div>
  );

  if (orgsQuery.isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Creators</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform staff can add creators into any merchant organization. Ops /
            Superadmin only.
          </p>
        </div>
        <AddPlatformCreatorDialog orgOptions={orgOptions} />
      </div>

      {creatorsQuery.isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : creatorsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {creatorsQuery.error instanceof Error
            ? creatorsQuery.error.message
            : "Unable to load creators"}
        </p>
      ) : (
        <DataTable
          tableId="platform-creators"
          columns={columns}
          data={tableState.data}
          totalCount={tableState.totalCount}
          pagination={tableState.pagination}
          onPaginationChange={tableState.onPaginationChange}
          sorting={tableState.sorting}
          onSortingChange={tableState.onSortingChange}
          search={search}
          onSearchChange={setSearch}
          toolbarFilters={toolbarFilters}
          filterActive={Boolean(orgFilter)}
          isFetching={creatorsQuery.isFetching}
          isError={creatorsQuery.isError}
          onRetry={() => void creatorsQuery.refetch()}
          onRefresh={() => void creatorsQuery.refetch()}
          getRowId={(row) => row.id}
          ariaLabel="Platform creators"
          pageSizeOptions={[10, 20, 50]}
        />
      )}
    </div>
  );
}
