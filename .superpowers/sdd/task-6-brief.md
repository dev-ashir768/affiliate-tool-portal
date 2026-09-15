### Task 6: DataTable types, empty/error/skeleton, download + page helpers

**Files:**
- Create: `components/data-table/types.ts`
- Create: `components/data-table/utils/export-download.ts`
- Create: `components/data-table/utils/pagination.ts`
- Create: `components/data-table/utils/pagination.selfcheck.ts`
- Create: `components/data-table/data-table-empty.tsx`
- Create: `components/data-table/data-table-error.tsx`
- Create: `components/data-table/data-table-skeleton.tsx`
- Test: `components/data-table/utils/pagination.selfcheck.ts`

**Interfaces:**
- Consumes: TanStack types
- Produces: `DataTableProps<TData>`, `dataTableFeatures`, `downloadBlob`, `getPaginationItems`, empty/error/skeleton components

- [ ] **Step 1: Shared features + props types**

```ts
// components/data-table/types.ts
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
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
```

Note: If `ColumnDef` generic arity differs in the installed v9 build, adjust to match package types (`createColumnHelper` pattern in Task 9). Prefer compiling against installed types over guessing.

- [ ] **Step 2: Download + pagination helpers**

```ts
// components/data-table/utils/export-download.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

```ts
// components/data-table/utils/pagination.ts
export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  currentPage: number, // 1-based
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (
    let p = Math.max(1, currentPage - siblingCount);
    p <= Math.min(totalPages, currentPage + siblingCount);
    p++
  ) {
    pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}
```

```ts
// components/data-table/utils/pagination.selfcheck.ts
import { getPaginationItems } from "./pagination";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(
  JSON.stringify(getPaginationItems(1, 13)) ===
    JSON.stringify([1, 2, "ellipsis", 13]),
  "page 1",
);
assert(
  JSON.stringify(getPaginationItems(7, 13)) ===
    JSON.stringify([1, "ellipsis", 6, 7, 8, "ellipsis", 13]),
  "middle",
);
console.log("pagination.selfcheck: ok");
```

Run: `npx tsx components/data-table/utils/pagination.selfcheck.ts`

- [ ] **Step 3: Empty / Error / Skeleton**

```tsx
// components/data-table/data-table-empty.tsx
"use client";

import { Button } from "@/components/ui/button";

type Props = {
  search?: string;
  onClearSearch?: () => void;
};

export function DataTableEmpty({ search, onClearSearch }: Props) {
  const hasSearch = Boolean(search?.trim());
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">
        {hasSearch ? `No results found for "${search}"` : "No records found"}
      </p>
      {hasSearch && onClearSearch ? (
        <Button type="button" variant="outline" size="sm" onClick={onClearSearch}>
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
```

```tsx
// components/data-table/data-table-error.tsx
"use client";

import { Button } from "@/components/ui/button";

type Props = { onRetry?: () => void };

export function DataTableError({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">Something went wrong</p>
      <p className="text-sm text-muted-foreground">Unable to load data.</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
```

```tsx
// components/data-table/data-table-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = { columnCount?: number; rowCount?: number };

export function DataTableSkeleton({
  columnCount = 6,
  rowCount = 8,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columnCount }).map((_, c) => (
              <TableCell key={c}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/data-table/
git commit -m "feat: add DataTable types, states, and pagination helpers"
```

---

