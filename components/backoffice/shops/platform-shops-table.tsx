"use client";

import { useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { usePlatformShops } from "@/hooks/use-platform";
import type { PlatformListParams, PlatformShopRow } from "@/types/platform";
import { cn } from "cn";

const columnHelper = createColumnHelper<DataTableFeatures, PlatformShopRow>();

const shopsColumns = columnHelper.columns([
  columnHelper.accessor((row) => row.organization.name, {
    id: "organization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organization" />
    ),
    meta: { label: "Organization" },
    enableSorting: false,
  }),
  columnHelper.accessor(
    (row) => row.displayName ?? row.externalShopId ?? "—",
    {
      id: "shop",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shop" />
      ),
      meta: { label: "Shop" },
      enableSorting: false,
    },
  ),
  columnHelper.accessor("region", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    meta: { label: "Region" },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { label: "Status" },
    cell: (info) => (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full px-2.5 py-0.5 font-medium capitalize",
          info.getValue() === "ACTIVE"
            ? "border-transparent bg-primary text-primary-foreground"
            : "",
        )}
      >
        {info.getValue().replace(/_/g, " ").toLowerCase()}
      </Badge>
    ),
  }),
  columnHelper.accessor("botEmail", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bot email" />
    ),
    meta: { label: "Bot email" },
    enableSorting: false,
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue() ?? "—"}</span>
    ),
  }),
]);

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString,
  sortOrder: parseAsStringEnum(["asc", "desc"]),
};

export function PlatformShopsTable() {
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

  const query = usePlatformShops(listParams);
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
        <h1 className="text-lg font-semibold tracking-tight">All shops</h1>
        <p className="text-sm text-muted-foreground">
          Cross-tenant shop connections and verification status.
        </p>
      </div>
      <DataTable
        tableId="backoffice-shops"
        columns={shopsColumns}
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
