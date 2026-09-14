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
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableExportFormat = "csv" | "xlsx";

export type { ColumnOrderState, ColumnSizingState, ColumnVisibilityState };

export type DataTableProps<TData extends Record<string, unknown>> = {
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
  onExport?: (format: DataTableExportFormat) => Promise<void>;
  onRefresh?: () => void;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  pageSizeOptions?: number[];
  getRowId?: (row: TData) => string;
};
