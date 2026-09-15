### Task 7: Toolbar pieces (header, visibility, pagination, export, toolbar)

**Files:**
- Create: `components/data-table/data-table-column-header.tsx`
- Create: `components/data-table/data-table-column-visibility.tsx`
- Create: `components/data-table/data-table-pagination.tsx`
- Create: `components/data-table/data-table-export.tsx`
- Create: `components/data-table/data-table-toolbar.tsx`

**Interfaces:**
- Consumes: TanStack `Table` instance / column APIs, `getPaginationItems`
- Produces: toolbar subcomponents used by `DataTable`

- [ ] **Step 1: Column header (sort cycle + drag handle)**

Implement a header button that calls `column.toggleSorting()` in a way that cycles **none â†’ asc â†’ desc â†’ none**. With TanStack, prefer:

```ts
const sorted = column.getIsSorted();
if (sorted === false) column.toggleSorting(false); // asc
else if (sorted === "asc") column.toggleSorting(true); // desc
else column.clearSorting();
```

Show `ArrowUp` / `ArrowDown` / `ArrowUpDown` icons; set `aria-sort` to `ascending` | `descending` | `none`. If `enableColumnOrdering`, render a drag handle with `provided.dragHandleProps` from parent (or accept `dragHandleProps` prop). Do not start a sort when interacting with the drag handle (`stopPropagation` on pointer down).

- [ ] **Step 2: Column visibility dropdown**

Use `DropdownMenu` + `Checkbox` for each `table.getAllLeafColumns().filter(c => c.getCanHide())`. Label from column header string or `column.id`.

- [ ] **Step 3: Pagination footer**

Show `Showing {from}â€“{to} of {total}`. Buttons: Previous, numbered/`ellipsis` via `getPaginationItems`, Next. Page size `Select` with `pageSizeOptions`. Convert `pageIndex` (0-based) â†” display page (1-based). Disable Previous when `pageIndex === 0`; disable Next when on last page. Disable controls when `isLoading`/`disabled`.

- [ ] **Step 4: Export menu**

`DropdownMenu` with CSV / Excel items. Call `onExport(format)`. Local `exporting` flag or parent `isExporting` â€” disable menu while pending; show spinner on trigger. On failure, show inline `text-destructive` message under toolbar actions (no toast).

- [ ] **Step 5: Toolbar**

Layout:

```text
[ Search input flex-1 ]   [ Columns ] [ Refresh ] [ Export ]
```

- Debounce search 400ms with local input state synced from `search` prop.
- Refresh: `Button` icon `RefreshCw`, `aria-label="Refresh"`, spin when `isFetching`, disabled while fetching; call `onRefresh`.
- Wrap with `flex flex-wrap gap-2` for responsive behavior.

- [ ] **Step 6: Commit**

```bash
git add components/data-table/
git commit -m "feat: add DataTable toolbar, pagination, and column controls"
```

---

