"use client";

import { useEffect } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { auditColumns, type PlatformAuditRow } from "./audit-columns";

type AuditResponse = {
  data: PlatformAuditRow[];
  meta: { total: number; page: number; pageSize: number };
};

type AuditParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

async function fetchAudit(
  params: AuditParams,
  signal?: AbortSignal,
): Promise<AuditResponse> {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  if (params.search) qs.set("search", params.search);
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const res = await fetch(`/api/platform/audit?${qs}`, {
    credentials: "include",
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load audit logs");
  }
  return data as AuditResponse;
}

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString.withDefault(""),
  sortOrder: parseAsString.withDefault(""),
};

export function AuditLogPage() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });

  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : undefined;

  const listParams: AuditParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    sortBy: params.sortBy || undefined,
    sortOrder,
  };

  const query = useQuery({
    queryKey: ["platform", "audit", listParams],
    queryFn: ({ signal }) => fetchAudit(listParams, signal),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const totalCount = query.data?.meta.total ?? 0;
  const pageCount =
    query.data == null
      ? null
      : Math.max(1, Math.ceil(totalCount / Math.max(1, params.pageSize)));

  useEffect(() => {
    if (pageCount != null && params.page > pageCount) {
      void setParams({ page: pageCount });
    }
  }, [pageCount, params.page, setParams]);

  const pagination: PaginationState = {
    pageIndex: Math.max(0, params.page - 1),
    pageSize: params.pageSize,
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    const pageSizeChanged = next.pageSize !== pagination.pageSize;
    void setParams({
      page: pageSizeChanged ? 1 : next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  const sorting: SortingState = params.sortBy
    ? [{ id: params.sortBy, desc: sortOrder !== "asc" }]
    : [];

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    void setParams({
      sortBy: first?.id ?? "",
      sortOrder: first ? (first.desc ? "desc" : "asc") : "",
      page: 1,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Audit log
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent platform security and staff actions.
        </p>
      </div>

      <DataTable
        tableId="backoffice-audit-log"
        columns={auditColumns}
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
        ariaLabel="Platform audit log"
      />
    </div>
  );
}
