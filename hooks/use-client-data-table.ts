"use client";

import { useMemo, useState } from "react";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

type UseClientDataTableOptions<T> = {
  data: T[];
  /** Text used for toolbar search filtering. */
  getSearchText?: (row: T) => string;
  /** Resolve sortable value by column id (accessor key). */
  getSortValue?: (row: T, columnId: string) => string | number | null | undefined;
  initialPageSize?: number;
};

export function useClientDataTable<T extends object>({
  data,
  getSearchText,
  getSortValue,
  initialPageSize = 20,
}: UseClientDataTableOptions<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const filteredSorted = useMemo(() => {
    let rows = data;

    const q = search.trim().toLowerCase();
    if (q && getSearchText) {
      rows = rows.filter((row) => getSearchText(row).toLowerCase().includes(q));
    }

    const sort = sorting[0];
    if (sort) {
      const dir = sort.desc ? -1 : 1;
      rows = [...rows].sort((a, b) => {
        const av =
          getSortValue?.(a, sort.id) ??
          (a as Record<string, unknown>)[sort.id];
        const bv =
          getSortValue?.(b, sort.id) ??
          (b as Record<string, unknown>)[sort.id];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number" && typeof bv === "number") {
          return (av - bv) * dir;
        }
        return String(av).localeCompare(String(bv), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * dir;
      });
    }

    return rows;
  }, [data, getSearchText, getSortValue, search, sorting]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredSorted.length / Math.max(1, pagination.pageSize)),
  );
  const safePageIndex = Math.min(pagination.pageIndex, pageCount - 1);

  const pageData = useMemo(() => {
    const start = safePageIndex * pagination.pageSize;
    return filteredSorted.slice(start, start + pagination.pageSize);
  }, [filteredSorted, pagination.pageSize, safePageIndex]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setPagination((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next.pageSize !== prev.pageSize) {
        return { ...next, pageIndex: 0 };
      }
      return next;
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    data: pageData,
    totalCount: filteredSorted.length,
    pagination: { ...pagination, pageIndex: safePageIndex },
    onPaginationChange,
    sorting,
    onSortingChange,
    search,
    onSearchChange,
  };
}
