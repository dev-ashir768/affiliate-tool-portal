### Task 8: Main `DataTable` (TanStack v9 + DnD + resize)

**Files:**
- Create: `components/data-table/data-table.tsx`
- Create: `components/data-table/index.ts`

**Interfaces:**
- Consumes: all Task 5â€“7 pieces, `DataTableProps`
- Produces: `<DataTable />` export

- [ ] **Step 1: Implement DataTable**

Core wiring (v9):

```tsx
const prefs = useDataTablePreferences(tableId);

const table = useTable({
  features: dataTableFeatures,
  data,
  columns,
  getRowId,
  manualPagination: true,
  manualSorting: true,
  rowCount: totalCount,
  state: {
    pagination,
    sorting,
    columnVisibility: prefs.columnVisibility,
    columnOrder: prefs.columnOrder,
    columnSizing: prefs.columnSizing,
  },
  onPaginationChange,
  onSortingChange,
  onColumnVisibilityChange: prefs.setColumnVisibility,
  onColumnOrderChange: prefs.setColumnOrder,
  onColumnSizingChange: prefs.setColumnSizing,
  enableColumnResizing: enableColumnResizing ?? true,
  columnResizeMode: "onChange",
  defaultColumn: {
    minSize: 80,
    size: 160,
    maxSize: 480,
  },
});
```

Render order:

1. Toolbar
2. If `isError` && !data length â†’ `DataTableError`
3. Else if `isLoading` â†’ `DataTableSkeleton`
4. Else table body:
   - Wrap header row drag-and-drop with `@hello-pangea/dnd` `DragDropContext` / `Droppable` / `Draggable` **only if** `enableColumnOrdering`.
   - On drag end, reorder `columnOrder` (initialize order from leaf column ids if empty).
   - Use `table.getHeaderGroups()` / `flexRender` for headers and cells.
   - Apply column size styles: `style={{ width: header.getSize() }}` / cell size.
   - Resize handle on `TableHead` using `header.getResizeHandler()` when resizing enabled.
   - Soft fetch: `relative` wrapper + `opacity-60` overlay when `isFetching && !isLoading`.
   - If no rows â†’ `DataTableEmpty`.
5. Pagination footer always (unless error with no data).

Accessibility: table has caption or `aria-label` from optional prop defaulting to `"Data table"`.

- [ ] **Step 2: Barrel export**

```ts
// components/data-table/index.ts
export { DataTable } from "./data-table";
export type { DataTableProps, DataTableExportFormat } from "./types";
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors related to DataTable. Fix v9 type arity / feature option names against compiler output if needed.

- [ ] **Step 4: Commit**

```bash
git add components/data-table/
git commit -m "feat: implement reusable DataTable with sort, resize, and column DnD"
```

---

