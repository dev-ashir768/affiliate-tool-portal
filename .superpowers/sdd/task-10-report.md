# Task 10 Report: Manual verification pass

**Status:** DONE  
**Date:** 2026-09-14  
**Branch:** feat/shopify-app-shell  
**Commit:** 95b27b7 — fix: address DataTable QA findings  
**Pushed:** no

---

## Summary

Ran the DataTable QA checklist against `/backoffice/users` on the local Next.js dev server (`http://localhost:3000`). `npm run lint` and `npx tsc --noEmit` both passed. List/export APIs and SSR HTML markers were exercised with `Invoke-WebRequest`. Two real bugs were found and fixed; no empty commit.

No headed browser session was available, so click-through items (sort cycle, debounce timing, DnD, resize, error throw, viewport) were verified by code review plus API/HTML evidence.

---

## Fixes (commit `95b27b7`)

### 1. Columns dropdown crash

**Symptom:** Opening **Columns** threw `Base UI: MenuGroupContext is missing. Menu group parts must be used within <Menu.Group> or <Menu.RadioGroup>.`  
Stack: `DropdownMenuLabel` → `DataTableColumnVisibility`. Observed twice in the running `npm run dev` browser log.

**Cause:** shadcn `DropdownMenuLabel` is Base UI `Menu.GroupLabel`, which requires a `Menu.Group` parent.

**Fix:** Wrap the label and checkbox items in `DropdownMenuGroup` in `components/data-table/data-table-column-visibility.tsx`.

### 2. pageSize change left an empty page

**Symptom:** `GET /api/users?page=5&pageSize=50` returns `{ data: [], meta: { total: 100, page: 5, pageSize: 50 } }`. Changing **Rows per page** while on page 5 of 20-row pages would show an empty table and a broken “Showing X–Y of Z” range.

**Fix:** In `UsersTable.onPaginationChange`, if `pageSize` changed, reset `page` to `1` (same as search/sort).

---

## Step 1: Spec checklist

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | `/backoffice/users` loads with skeleton then rows | **Pass (partial)** | Page HTML 200 (`64050` bytes). `isLoading` renders `DataTableSkeleton`; mock API delays 400ms. Live skeleton→rows transition not click-verified. |
| 2 | Page / pageSize change → network; Showing X–Y; Prev/Next bounds | **Pass after fix** | API page/pageSize variants 200 (see below). HTML includes `Showing`, `Previous`, `Next`, `Rows per page`. Pagination disables Previous on first page and Next on last. pageSize now resets to page 1. |
| 3 | Sort cycles none → asc → desc → none; URL params | **Pass (code + API)** | `cycleSorting` in `data-table-column-header.tsx`. `onSortingChange` writes `sortBy`/`sortOrder` (or null) and `page=1`. API asc/desc verified. Click cycle not browser-tested. |
| 4 | Search debounced; page resets to 1; empty copy + clear | **Pass (code + API)** | Toolbar debounce 400ms; `onSearchChange` sets `search` + `page: 1`. Search `User 001` → 1 row; `zzz-none` → 0 rows. Empty UI: `No results found for "…"` + **Clear search**. Those strings are conditional, so absent from default SSR HTML. |
| 5 | Column hide/show, reorder, resize survive refresh (`datatable-preferences`) | **Pass after Columns fix (code)** | Zustand persist key is `datatable-preferences`. Hide/show was crashing (fixed). Reorder/resize persist via `useDataTablePreferences`. Refresh survival not browser-tested. |
| 6 | Refresh refetches; spinner; no double-fire | **Pass (code)** | Refresh button `aria-label="Refresh"`; `onRefresh` → `query.refetch()`; `RefreshCw` spins when `isFetching`. Overlay uses `pointer-events-none`. Dev logs sometimes show two initial list GETs (React Strict Mode); refresh handler itself is a single `refetch`. |
| 7 | Export CSV + Excel with current search/sort | **Pass** | See export table below. Client `onExport` forwards `search`/`sortBy`/`sortOrder` and downloads `users.csv` / `users.xlsx`. |
| 8 | Simulate error in `fetchUsers` → error UI + Try Again | **Pass (code only)** | Did **not** leave a throw in `fetchUsers`. `DataTableError` copy + **Try Again** exist; shown when `isError && data.length === 0`. |
| 9 | Narrow viewport → horizontal scroll; toolbar wraps | **Pass (code)** | `Table` wrapper is `overflow-x-auto`; toolbar is `flex flex-wrap`. Not viewport-tested. |

---

## Build / lint

| Command | Result |
|---------|--------|
| `npm run lint` | Pass (exit 0, no findings) |
| `npx tsc --noEmit` | Pass (exit 0) |
| `npx eslint` on changed files after fix | Pass |
| `npx tsc --noEmit` after fix | Pass |

`npm run build` was not re-run this pass; `tsc --noEmit` is the type gate requested by the task.

---

## List API (`GET /api/users`)

Base: `http://localhost:3000`. All successful calls returned `200` + `application/json`. Dataset: 100 mock users.

| Variant | Result |
|---------|--------|
| `page=1&pageSize=20` | 20 rows, `meta.total=100`, first `usr_001` |
| `page=2&pageSize=10` | 10 rows, first `usr_011` |
| `page=5&pageSize=20` | last page, 20 rows, `usr_081`–`usr_100` |
| `page=6&pageSize=20` | 0 rows, `total=100` (past last page) |
| `page=5&pageSize=50` | 0 rows — **QA bug**, client now resets page on pageSize change |
| `search=User 001` | 1 row, `User 001` |
| `search=zzz-none` | 0 rows, `total=0` |
| `sortBy=name&sortOrder=asc&pageSize=5` | `User 001` … `User 005` |
| `sortBy=name&sortOrder=desc&pageSize=5` | `User 100` … `User 096` |
| `search=admin&sortBy=email&sortOrder=asc&pageSize=10` | `total=34`, first `user100@example.com` (role admin) |

---

## Export API (`GET /api/users/export`)

| Variant | Status | Content-Type | Body |
|---------|--------|--------------|------|
| `format=csv` | 200 | `text/csv; charset=utf-8` | 8610 bytes; header `id,name,email,role,status,shop,createdAt`; 101 lines (header + 100 rows) |
| `format=xlsx` | 200 | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | 10767 bytes (non-empty) |
| `format=csv&search=admin&sortBy=email&sortOrder=asc` | 200 | `text/csv; charset=utf-8` | 2889 bytes; first data row `usr_100` / `user100@example.com` (matches sorted list) |
| `format=pdf` | 400 | — | invalid format |

---

## Page HTML (`GET /backoffice/users`)

- Status: **200**
- Content-Type: `text/html; charset=utf-8`
- Length: 64050 bytes

**Present:** Search, Columns, Export, Showing, Previous, Next, Rows per page, Refresh

**Absent (expected — conditional UI):** Clear search, No records found, Something went wrong, Try Again

Those four are implemented in `DataTableEmpty` / `DataTableError` and only render for empty search / error states.

---

## Step 2: Commit

```bash
git add components/data-table/data-table-column-visibility.tsx components/backoffice/users/users-table.tsx
git commit -m "fix: address DataTable QA findings"
```

- SHA: `95b27b7`
- 2 files changed, 15 insertions, 11 deletions
- Not pushed
- Did not modify `graphify-out/`

---

## Self-Review

| Area | Assessment |
|------|------------|
| Checklist coverage | All 9 spec items exercised via API, HTML, and/or code |
| Real bugs | Two fixed and committed |
| Types / lint | Clean after the fix |
| Scope | Only QA fixes; no graphify-out; no push |
| Browser | No headed session; interactive DnD/resize/sort-click/error-throw remain residual |

---

## Concerns / Notes

1. **`@hello-pangea/dnd` nested scroll warning** — Dev console: “Droppable: unsupported nested scroll container detected.” App shell `main` is `overflow-y-auto` and the table wrapper is `overflow-x-auto`. Development-only warning; column drag may be flaky when both axes scroll. Not changed in this pass (horizontal scroll is required by the spec).
2. **Out-of-range URL pages still empty** — Direct `?page=6&pageSize=20` still returns 0 rows. Only **pageSize** changes reset to page 1. A clamp-to-last-page effect was not added.
3. **No headed browser** — Skeleton flash, sort click cycle, debounce delay, column DnD/resize persistence, Refresh spinner, error injection, and narrow-viewport wrap were not click-verified.
4. **Initial list GET sometimes fires twice** in dev (Strict Mode / RSC + client). Refresh is a single `refetch`.
5. **`isExporting` is not passed** from `UsersTable` into `DataTable`; `DataTableExport` still uses local exporting state, so the spinner works.

---

## Files changed (this task)

- `components/data-table/data-table-column-visibility.tsx`
- `components/backoffice/users/users-table.tsx`
- `.superpowers/sdd/task-10-report.md` (this report; not in the fix commit)
