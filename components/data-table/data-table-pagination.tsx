"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DataTableFeatures } from "@/components/data-table/types";
import { getPaginationItems } from "@/components/data-table/utils/pagination";

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export type DataTablePaginationProps<TData extends object> = {
  table: Table<DataTableFeatures, TData>;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  disabled?: boolean;
};

export function DataTablePagination<TData extends object>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading = false,
  disabled = false,
}: DataTablePaginationProps<TData>) {
  const pagination = table.atoms.pagination.get();
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const totalCount = table.getRowCount();
  const pageCount = table.getPageCount();
  const lastPageIndex = Math.max(0, pageCount - 1);
  const clampedPageIndex =
    pageCount <= 0 ? 0 : Math.min(Math.max(0, pageIndex), lastPageIndex);
  const currentPage = pageCount <= 0 ? 1 : clampedPageIndex + 1;
  const controlsDisabled = isLoading || disabled;
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageCount <= 0 || pageIndex >= pageCount - 1;
  const from = totalCount === 0 ? 0 : clampedPageIndex * pageSize + 1;
  const to = Math.min(totalCount, (clampedPageIndex + 1) * pageSize);
  const items = getPaginationItems(currentPage, Math.max(pageCount, 0));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {totalCount}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Rows per page</span>
          <Select
            value={pageSize}
            onValueChange={(value) => {
              if (value == null) return;
              table.setPageSize(Number(value));
            }}
            disabled={controlsDisabled}
          >
            <SelectTrigger
              size="sm"
              className="w-[4.5rem]"
              aria-label="Rows per page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <nav
          className="flex flex-wrap items-center gap-1"
          aria-label="Pagination"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={controlsDisabled || isFirstPage}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>

          {items.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1.5 text-sm text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                type="button"
                variant={item === currentPage ? "default" : "outline"}
                size="sm"
                className="min-w-7 px-2"
                aria-current={item === currentPage ? "page" : undefined}
                disabled={controlsDisabled}
                onClick={() => table.setPageIndex(item - 1)}
              >
                {item}
              </Button>
            ),
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={controlsDisabled || isLastPage}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
}
