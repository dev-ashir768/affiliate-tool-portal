# Production DataTable Design

Date: 2026-09-14  
Status: Approved for implementation planning  
Scope: Reusable server-driven DataTable + mock Users API demo on backoffice Users page

## Goal

Ship a production-grade, reusable DataTable for the affiliate portal that supports server-side pagination, sorting, and search; column visibility/order/sizing with persisted preferences; CSV/Excel export via API-shaped endpoints; and polished loading/empty/error states—wired first to Backoffice Users with a mock API that a real backend can replace later.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Architecture | Controlled DataTable + React Query + thin services (Approach 1) |
| First consumer | Backoffice Users (`/backoffice/users`) |
| Transient table state | URL query params via `nuqs`: `page`, `pageSize`, `search`, `sortBy`, `sortOrder` |
| Persisted preferences | Zustand + `localStorage`, keyed by `tableId` (visibility, order, sizing) |
| Export strategy | Mock export endpoints returning file blobs (`format=csv\|xlsx`) |
| Column DnD | Existing `@hello-pangea/dnd` |
| Table engine | Existing `@tanstack/react-table` v9 |
| Data fetching | Existing `@tanstack/react-query` |
| Excel library | Add `exceljs` |
| UI primitives | Existing shadcn/ui Table + Button, Input, Select, DropdownMenu, Tooltip; add Checkbox, Skeleton (and Popover if needed) |
| Virtualization | Not required for v1 (server pagination limits rows) |

## Architecture

```
URL (nuqs)
  page, pageSize, search, sortBy, sortOrder
        │
        ▼
useUsersQuery (React Query)
        │  queryKey: ["users", params]
        ▼
services/users.ts  →  GET /api/users?...
        │
        ▼
{ data: User[], meta: { total, page, pageSize } }
        │
        ▼
UsersPage → <DataTable tableId="backoffice-users" ... />
        │
        ├── TanStack Table (sorting UI, visibility, order, sizing, row model)
        ├── Zustand persist (columnVisibility, columnOrder, columnSizing)
        └── Export → GET /api/users/export?format=csv|xlsx&search&sort...
```

### Boundaries

| Unit | Responsibility |
|------|----------------|
| `components/data-table/*` | Reusable generic table UI; no Users/domain knowledge |
| `app/api/users/*` | Mock Next.js route handlers (list + export) until real backend exists |
| `services/users.ts` | Thin client fetch wrappers |
| `hooks/use-users.ts` | React Query hooks for list + export |
| `types/users.ts` | User + list/export param/response types |
| `components/backoffice/users/*` | Column defs + page composition only |
| Zustand preferences store | Column visibility/order/sizing keyed by `tableId` |

### Swap to real API later

Replace mock route handlers (or point `services/users.ts` at the backend base URL). Keep the list/export query and response shapes stable so the DataTable and Users page need no rewrite.

## Folder layout

```
components/data-table/
  data-table.tsx
  data-table-toolbar.tsx
  data-table-pagination.tsx
  data-table-column-header.tsx
  data-table-column-visibility.tsx
  data-table-export.tsx
  data-table-skeleton.tsx
  data-table-empty.tsx
  data-table-error.tsx
  hooks/use-data-table-preferences.ts
  store/data-table-preferences-store.ts
  types.ts
  utils/export-download.ts

components/backoffice/users/
  users-table.tsx          # wires DataTable + columns + hooks
  users-columns.tsx

app/api/users/route.ts
app/api/users/export/route.ts

services/users.ts
hooks/use-users.ts
types/users.ts

app/(backoffice)/backoffice/users/page.tsx  # renders UsersTable
```

New dependencies to install: `zustand`, `nuqs`, `exceljs`.  
New shadcn components: `checkbox`, `skeleton` (Popover only if toolbar needs it).

## Component API

```tsx
<DataTable<TData>
  tableId="backoffice-users"
  columns={columns}
  data={rows}
  totalCount={total}
  pagination={{ pageIndex, pageSize }}
  onPaginationChange={...}
  sorting={[{ id, desc }]}
  onSortingChange={...}
  search={search}
  onSearchChange={...}
  isLoading={isLoading}
  isFetching={isFetching}
  isError={isError}
  onRetry={() => refetch()}
  onExport={async (format: "csv" | "xlsx") => { ... }}
  enableColumnResizing
  enableColumnOrdering
  pageSizeOptions={[10, 20, 50, 100]}
/>
```

### Behavior details

- **Pagination:** Server-driven. Changing page or page size triggers a new request. Show “Showing X–Y of Z”. Disable Previous on first page and Next on last. Default page sizes: 10, 20, 50, 100 (default 20).
- **Sorting:** Server-driven. Sortable headers cycle `none → asc → desc → none`. Visual + `aria-sort` indicators. Only columns with sorting enabled participate.
- **Search:** Global input in toolbar. Debounce ~400ms. Reset to page 1 on change. Preserve sort. Empty query clears search filter. Latest request wins (React Query + abort/keying avoids stale races).
- **Column visibility:** Columns dropdown; columns with `enableHiding: false` cannot be hidden.
- **Column order:** Drag headers with `@hello-pangea/dnd`; sync TanStack `columnOrder`; persist.
- **Column sizing:** TanStack column resize; min width enforced; header/body stay aligned; horizontal scroll on overflow.
- **Refresh:** Refetches current query key; preserves URL + preference state; spinner + click guard while fetching.
- **Export:** Toolbar Export → CSV | Excel. Calls page-supplied `onExport` which hits mock export API with current search/sort (all matching rows). Loading + error handling in toolbar.
- **Responsive:** Toolbar wraps; table container `overflow-x-auto`; pagination remains usable on small screens.

## Mock API contract

### List — `GET /api/users`

Query:

```ts
{
  page: number;       // 1-based
  pageSize: number;
  search?: string;
  sortBy?: string;    // e.g. "name" | "email" | "role" | "status" | "shop" | "createdAt"
  sortOrder?: "asc" | "desc";
}
```

Response:

```ts
{
  data: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}
```

### Export — `GET /api/users/export`

Query: `format=csv|xlsx` plus the same `search`, `sortBy`, `sortOrder` as list (no page/pageSize; returns all matching rows).

Response: file download (`Content-Disposition` attachment) with correct MIME type.

### User model (demo)

```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  status: "active" | "invited" | "disabled";
  shop: string;
  createdAt: string; // ISO
};
```

Mock dataset: enough rows (~80–120) to exercise multi-page pagination, search, and sort. Artificial delay (~300–600ms) to surface loading states. Optional error simulation is out of scope for v1 (manual network throttle / forced error path via React Query is enough for QA).

## URL & persistence

### URL (`nuqs`)

| Param | Type | Default |
|-------|------|---------|
| `page` | number | 1 |
| `pageSize` | number | 20 |
| `search` | string | `""` |
| `sortBy` | string \| null | null |
| `sortOrder` | `"asc" \| "desc"` \| null | null |

### Zustand

- Store: single preferences store with `persist` middleware.
- Shape: `Record<tableId, { columnVisibility, columnOrder, columnSizing }>`.
- Storage key: `datatable-preferences` (internal map keys are table ids such as `backoffice-users`).
- Survives refresh, browser restart, and navigation away/back.

## UI states

| State | Behavior |
|-------|----------|
| Initial load (`isLoading`) | Skeleton rows; stable table height; controls disabled where needed |
| Soft fetch (`isFetching` && data) | Keep rows; subtle overlay or refresh spinner; avoid layout jump |
| Empty (no search) | “No records found” |
| Empty (with search) | `No results found for "{query}"` + clear-search action |
| Error | “Something went wrong” / “Unable to load data.” + Try again → `onRetry` |
| Export in progress | Export control loading; do not freeze whole page |
| Export error | User-friendly message; no raw stack traces |

Follow existing chrome patterns (`border-border`, `bg-card`, muted pulse skeletons similar to sidebar).

## Accessibility

- Icon-only buttons have accessible names (`aria-label`).
- Sortable headers expose `aria-sort` and are keyboard-activatable.
- Dropdowns/selects use existing accessible shadcn primitives.
- Focus rings visible; do not rely on color alone for sort/loading state.
- Pagination controls labeled (Previous/Next/page numbers).

## Performance

- Server-side page/search/sort only—never load full dataset for table rendering.
- Debounced search; stable `queryKey`; avoid duplicate requests (refresh click guard).
- Stable column definitions (module-level or memoized in Users feature).
- No row virtualization in v1.
- Export is a separate request; UI stays interactive aside from export control loading.

## Testing / verification (manual for v1)

1. Open `/backoffice/users` — first page loads with skeleton then rows.
2. Change page / page size — network request updates; “Showing X–Y of Z” correct; Prev/Next disabled at bounds.
3. Sort a column through none/asc/desc — URL + request params update; indicator correct.
4. Search with debounce — page resets to 1; empty results copy correct; clear search works.
5. Toggle columns, reorder headers, resize — survive refresh via Zustand.
6. Refresh button — refetch same params; spinner + no double-fire.
7. Export CSV and Excel — downloads reflect search/sort; visible loading on control.
8. Force error (e.g. temporary bad fetch) — error state + Try again recovers.
9. Narrow viewport — horizontal scroll on table; toolbar wraps; pagination usable.

## Out of scope (v1)

- Real backend / auth-gated API
- Row selection bulk actions
- Per-column filters
- Infinite scroll / virtualization
- Persisting page size in Zustand (URL only)
- Toast system (use inline toolbar/table messaging)

## Open backend note

When a real API ships, it must support the list query/meta shape and an export endpoint (or the client export service must be retargeted). Frontend should not fake full-dataset export by looping list pages once a real export API exists—prefer the dedicated export endpoint.
