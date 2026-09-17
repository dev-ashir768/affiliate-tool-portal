"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import type { DataTableFeatures } from "@/components/data-table/types";
import { usePlatformOrganizations } from "@/hooks/use-platform";
import type {
  PlatformListParams,
  PlatformOrgSummary,
} from "@/types/platform";
import { buttonVariants } from "@/components/ui/button";

const columnHelper = createColumnHelper<DataTableFeatures, PlatformOrgSummary>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const organizationsColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: { label: "Name" },
    enableHiding: false,
    cell: (info) => (
      <Link
        href={`/backoffice/organizations/${info.row.original.id}`}
        className={buttonVariants({
          variant: "link",
          className: "h-auto px-0",
        })}
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("slug", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    meta: { label: "Slug" },
  }),
  columnHelper.accessor((row) => row.plan.name, {
    id: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    meta: { label: "Plan" },
    enableSorting: false,
  }),
  columnHelper.accessor("subscriptionStatus", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    meta: { label: "Subscription" },
    enableSorting: false,
    cell: (info) => info.getValue() ?? "—",
  }),
  columnHelper.accessor("memberCount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    meta: { label: "Members" },
    enableSorting: false,
  }),
  columnHelper.accessor("shopCount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shops" />
    ),
    meta: { label: "Shops" },
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    meta: { label: "Created" },
    cell: (info) => createdAtFormatter.format(new Date(info.getValue())),
  }),
]);

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString,
  sortOrder: parseAsStringEnum(["asc", "desc"]),
};

export function OrganizationsTable() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });

  const listParams: PlatformListParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    sortBy: params.sortBy ?? undefined,
    sortOrder: params.sortOrder ?? undefined,
  };

  const query = usePlatformOrganizations(listParams);
  const totalCount = query.data?.meta.total ?? 0;
  const knownPageCount =
    query.data == null
      ? null
      : Math.max(1, Math.ceil(totalCount / Math.max(1, params.pageSize)));

  useEffect(() => {
    if (knownPageCount == null) return;
    if (params.page > knownPageCount) {
      void setParams({ page: knownPageCount });
    }
  }, [knownPageCount, params.page, setParams]);

  const pagination: PaginationState = {
    pageIndex: Math.max(0, params.page - 1),
    pageSize: params.pageSize,
  };

  const sorting: SortingState = useMemo(() => {
    if (!params.sortBy || !params.sortOrder) return [];
    return [{ id: params.sortBy, desc: params.sortOrder === "desc" }];
  }, [params.sortBy, params.sortOrder]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    const pageSizeChanged = next.pageSize !== pagination.pageSize;
    void setParams({
      page: pageSizeChanged ? 1 : next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    void setParams({
      sortBy: first?.id ?? null,
      sortOrder: first ? (first.desc ? "desc" : "asc") : null,
      page: 1,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Organizations</h1>
        <p className="text-sm text-muted-foreground">
          All merchant tenants across the platform.
        </p>
      </div>
      <DataTable
        tableId="backoffice-organizations"
        columns={organizationsColumns}
        data={query.data?.data ?? []}
        totalCount={totalCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        search={params.search}
        onSearchChange={(value) => void setParams({ search: value, page: 1 })}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        enableColumnOrdering
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
