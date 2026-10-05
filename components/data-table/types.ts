import type { ReactNode } from "react";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  SortingState,
  ColumnVisibilityState,
} from "@tanstack/react-table";
import {
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<{ label?: string }>(),
});

export type DataTableFeatures = typeof dataTableFeatures;

export type { ColumnOrderState, ColumnSizingState, ColumnVisibilityState };

export type DataTableProps<TData extends object> = {
  tableId: string;
  columns: ColumnDef<DataTableFeatures, TData, unknown>[];
  data: TData[];
  totalCount: number;
  pagination: PaginationState; // pageIndex 0-based
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onRefresh?: () => void;
  onFiltersClick?: () => void;
  /** Optional toolbar leading slot (e.g. DateRangePicker). */
  toolbarLeading?: ReactNode;
  /** Filter controls rendered inside the toolbar filter menu. */
  toolbarFilters?: ReactNode;
  /** Highlight filter icon when filters are active. */
  filterActive?: boolean;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  pageSizeOptions?: number[];
  getRowId?: (row: TData) => string;
  ariaLabel?: string;
};
