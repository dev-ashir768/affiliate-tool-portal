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
import {
  AppReactSelect,
  stringSelectValue,
  type SelectOption,
} from "@/components/ui/react-select";
import { buttonVariants } from "@/components/ui/button";
import {
  usePlatformOrganizations,
  usePlatformPlans,
} from "@/hooks/use-platform";
import type {
  PlatformListParams,
  PlatformOrgSummary,
} from "@/types/platform";

const columnHelper = createColumnHelper<DataTableFeatures, PlatformOrgSummary>();

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const periodFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "TRIALING", label: "Trialing" },
  { value: "PAST_DUE", label: "Past due" },
  { value: "CANCELED", label: "Canceled" },
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "NONE", label: "No subscription" },
];

const TIER_OPTIONS: SelectOption[] = [
  { value: "", label: "All tiers" },
  { value: "access", label: "With access" },
  { value: "paid", label: "Paid plan" },
  { value: "free", label: "Free plan" },
];

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
  columnHelper.accessor("hasProductAccess", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Access" />
    ),
    meta: { label: "Access" },
    enableSorting: false,
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("currentPeriodEnd", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period end" />
    ),
    meta: { label: "Period end" },
    enableSorting: false,
    cell: (info) => {
      const v = info.getValue();
      return v ? periodFormatter.format(new Date(v)) : "—";
    },
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
  subscriptionStatus: parseAsString.withDefault(""),
  planCode: parseAsString.withDefault(""),
  billingTier: parseAsStringEnum(["free", "paid", "access"]),
};

export function OrganizationsTable() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });
  const plansQuery = usePlatformPlans();

  const planOptions: SelectOption[] = useMemo(() => {
    const plans = plansQuery.data?.plans ?? [];
    return [
      { value: "", label: "All plans" },
      ...plans.map((p) => ({ value: p.code, label: p.name })),
    ];
  }, [plansQuery.data?.plans]);

  const listParams: PlatformListParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    sortBy: params.sortBy ?? undefined,
    sortOrder: params.sortOrder ?? undefined,
    subscriptionStatus: params.subscriptionStatus || undefined,
    planCode: params.planCode || undefined,
    billingTier: params.billingTier ?? undefined,
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
          Customers (tenants) — filter by subscription health and plan.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <AppReactSelect
          className="min-w-[180px] max-w-xs flex-1"
          options={STATUS_OPTIONS}
          value={stringSelectValue(STATUS_OPTIONS, params.subscriptionStatus)}
          onChange={(opt) =>
            void setParams({
              subscriptionStatus: opt?.value ? String(opt.value) : "",
              page: 1,
            })
          }
          aria-label="Subscription status"
        />
        <AppReactSelect
          className="min-w-[160px] max-w-xs flex-1"
          options={planOptions}
          value={stringSelectValue(planOptions, params.planCode)}
          onChange={(opt) =>
            void setParams({
              planCode: opt?.value ? String(opt.value) : "",
              page: 1,
            })
          }
          aria-label="Plan"
        />
        <AppReactSelect
          className="min-w-[160px] max-w-xs flex-1"
          options={TIER_OPTIONS}
          value={stringSelectValue(TIER_OPTIONS, params.billingTier ?? "")}
          onChange={(opt) =>
            void setParams({
              billingTier: (opt?.value
                ? String(opt.value)
                : null) as "free" | "paid" | "access" | null,
              page: 1,
            })
          }
          aria-label="Billing tier"
        />
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
