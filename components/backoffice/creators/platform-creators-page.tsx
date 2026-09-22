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
  useCreatePlatformCreator,
  usePatchPlatformCreator,
  usePlatformCreators,
  usePlatformOrganizations,
} from "@/hooks/use-platform";
import {
  createPlatformCreatorsColumns,
} from "./platform-creators-columns";

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
  const create = useCreatePlatformCreator();
  const patch = usePatchPlatformCreator();

  const [organizationId, setOrganizationId] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!organizationId || !handle.trim()) {
      toast.error("Organization and handle are required");
      return;
    }
    try {
      await create.mutateAsync({
        organizationId,
        handle: handle.trim(),
        displayName: displayName.trim() || null,
        contactEmail: email.trim() || null,
      });
      setHandle("");
      setEmail("");
      setDisplayName("");
      toast.success("Creator added to organization");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  }

  if (orgsQuery.isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Creators</h1>
        <p className="text-sm text-muted-foreground">
          Platform staff can add creators into any merchant organization. Ops /
          Superadmin only.
        </p>
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <label className="text-xs text-muted-foreground">Organization</label>
          <AppReactSelect
            options={orgOptions}
            value={stringSelectValue(orgOptions, organizationId)}
            onChange={(opt) =>
              setOrganizationId(opt?.value ? String(opt.value) : "")
            }
            placeholder="Select org…"
            isSearchable
            aria-label="Organization"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Handle</label>
          <Input
            placeholder="@creator"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Display name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Contact email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Adding…" : "Add creator"}
          </Button>
        </div>
      </form>

      <AppReactSelect
        className="min-w-48 max-w-xs"
        options={orgOptions}
        value={stringSelectValue(orgOptions, orgFilter)}
        onChange={(opt) => setOrgFilter(opt?.value ? String(opt.value) : "")}
        placeholder="All organizations"
        isClearable
        isSearchable
        aria-label="Filter by organization"
      />

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
