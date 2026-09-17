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
import { DataTable } from "@/components/data-table";
import { InviteStaffDialog } from "@/components/backoffice/staff/invite-staff-dialog";
import { staffColumns } from "@/components/backoffice/staff/staff-columns";
import { usePlatformStaff } from "@/hooks/use-platform";
import type { PlatformListParams } from "@/types/platform";

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString,
  sortOrder: parseAsStringEnum(["asc", "desc"]),
};

const SORT_FIELDS = new Set(["name", "email", "role", "status", "createdAt"]);

export function StaffTable() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });

  const sortBy =
    params.sortBy && SORT_FIELDS.has(params.sortBy)
      ? params.sortBy
      : undefined;

  const listParams: PlatformListParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    sortBy,
    sortOrder: params.sortOrder ?? undefined,
  };

  const query = usePlatformStaff(listParams);
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
    if (!sortBy || !params.sortOrder) return [];
    return [{ id: sortBy, desc: params.sortOrder === "desc" }];
  }, [sortBy, params.sortOrder]);

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Staff users</h1>
          <p className="text-sm text-muted-foreground">
            Platform staff with SUPERADMIN, FINANCE, or OPS access.
          </p>
        </div>
        <InviteStaffDialog />
      </div>
      <DataTable
        tableId="backoffice-staff"
        columns={staffColumns}
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
