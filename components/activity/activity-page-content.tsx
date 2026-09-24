"use client";

import { useEffect, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import { useOrgAudit } from "@/hooks/use-org-audit";
import { ORG_AUDIT_FORBIDDEN } from "@/services/orgs";
import type { OrgAuditListParams } from "@/types/orgs";
import { activityColumns } from "./activity-columns";

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
};

export function ActivityPageContent() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });

  const listParams: OrgAuditListParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    from: params.from || undefined,
    to: params.to || undefined,
  };

  const query = useOrgAudit(listParams);
  const totalCount = query.data?.meta.total ?? 0;
  const knownPageCount =
    query.data?.meta.totalPages ??
    (query.data == null
      ? null
      : Math.max(1, Math.ceil(totalCount / Math.max(1, params.pageSize))));

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

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    const pageSizeChanged = next.pageSize !== pagination.pageSize;
    void setParams({
      page: pageSizeChanged ? 1 : next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  const onSearchChange = (value: string) => {
    void setParams({ search: value, page: 1 });
  };

  const sorting: SortingState = [];
  const onSortingChange: OnChangeFn<SortingState> = () => {};

  const dateRange: DateRangeValue = useMemo(
    () => ({ from: params.from, to: params.to }),
    [params.from, params.to],
  );

  const onDateRangeChange = (next: DateRangeValue) => {
    void setParams({
      from: next.from,
      to: next.to,
      page: 1,
    });
  };

  if (
    query.isError &&
    query.error instanceof Error &&
    query.error.message === ORG_AUDIT_FORBIDDEN
  ) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Organization audit trail for security-sensitive actions.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Owners and admins only</CardTitle>
            <CardDescription>
              The activity log is available to organization owners and admins.
              Ask an admin if you need access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Recent changes and actions in your organization.
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          disabled={query.isFetching}
        />
      </div>

      {query.isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load activity</CardTitle>
            <CardDescription>
              {query.error instanceof Error
                ? query.error.message
                : "Request failed"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable
          tableId="dashboard-org-activity"
          columns={activityColumns}
          data={query.data?.data ?? []}
          totalCount={totalCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          sorting={sorting}
          onSortingChange={onSortingChange}
          search={params.search}
          onSearchChange={onSearchChange}
          isLoading={query.isLoading}
          isFetching={query.isFetching}
          isError={query.isError}
          onRetry={() => void query.refetch()}
          onRefresh={() => void query.refetch()}
          enableColumnOrdering
          pageSizeOptions={[10, 20, 50, 100]}
          getRowId={(row) => row.id}
          ariaLabel="Organization activity log"
        />
      )}
    </div>
  );
}
