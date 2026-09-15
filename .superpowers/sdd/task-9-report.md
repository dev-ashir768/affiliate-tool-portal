# Task 9 Report: Users columns + page wiring

**Status:** DONE  
**Date:** 2026-09-14  
**Branch:** feat/shopify-app-shell  
**Commit:** be31bd4 — feat: wire Backoffice Users page to DataTable and mock API

---

## Summary

Wired `/backoffice/users` to the reusable DataTable: column defs for `User`, a client `UsersTable` that owns nuqs URL state + React Query + export, and a thin page that renders it.

---

## Steps Completed

### Step 1: Columns

Created `components/backoffice/users/users-columns.tsx`:

- `createColumnHelper<DataTableFeatures, UserRow>()` where `UserRow = User & Record<string, unknown>` (needed because `DataTable` constrains `TData extends Record<string, unknown>`)
- Columns: `name` (`enableHiding: false`), `email`, `role`, `status` (Badge), `shop`, `createdAt` (`toLocaleDateString()`)
- All sortable via function headers wrapping `DataTableColumnHeader`

Also exported `DataTableColumnHeader` from `components/data-table/index.ts`.

### Step 2: UsersTable

Created `components/backoffice/users/users-table.tsx` per brief: nuqs parsers, `useUsersQuery` / `useExportUsers`, controlled pagination/sort/search, `tableId="backoffice-users"`, `downloadBlob` on export. Search debounce stays in the DataTable toolbar. Set `enableColumnOrdering` so Task 10 can QA reorder.

### Step 3: Page

`app/(backoffice)/backoffice/users/page.tsx` now renders `<UsersTable />`.

### Step 4: Typecheck + smoke

```bash
npx tsc --noEmit
npx eslint components/backoffice/users app/(backoffice)/backoffice/users/page.tsx components/data-table/index.ts
curl.exe http://localhost:3000/api/users?page=1&pageSize=2
curl.exe http://localhost:3000/backoffice/users
```

### Step 5: Commit

```bash
git add components/backoffice/users app/(backoffice)/backoffice/users/page.tsx components/data-table/index.ts
git commit -m "feat: wire Backoffice Users page to DataTable and mock API"
```

- Commit SHA: `be31bd4`
- 4 files changed, 171 insertions, 1 deletion

---

## Self-Review

| Area | Assessment |
|------|------------|
| Brief compliance | Columns, UsersTable, page match spec; sortBy typed as `keyof User` |
| TanStack v9 | `createColumnHelper<DataTableFeatures, UserRow>`; compiles against installed types |
| URL state | nuqs `history: "replace"`, `shallow: true`; page resets to 1 on sort/search |
| Export | Passes current search/sort into `useExportUsers`; filenames `users.csv` / `users.xlsx` |
| Style | `"use client"`, semicolons, `@/` imports |
| Lint / types | ESLint clean; `tsc --noEmit` passes |

---

## Test Summary

| Test | Result |
|------|--------|
| `npx tsc --noEmit` | Pass |
| `npx eslint` (new/changed files) | Pass |
| `GET /api/users?page=1&pageSize=2` | 200; 2 rows, `meta.total` 100 |
| `GET /backoffice/users` | 200; HTML includes Search + Columns toolbar |

No click-through of skeleton → rows in a browser session.

---

## Concerns / Notes

1. **`User` vs `Record<string, unknown>`** — `data` is cast to `UserRow[]`. A shared row type (or relaxing the DataTable constraint) would avoid the cast.
2. **Column visibility labels** — Function headers mean the Columns menu falls back to ids (`createdAt`, not "Created").
3. **`enableColumnOrdering` is extra vs the brief snippet** — Default is `false`; enabled so Task 10 reorder QA can run.
4. **`createdAt` uses `toLocaleDateString()`** — UTC ISO mock dates can shift calendar day in local TZ.
5. **No E2E of skeleton → rows** — Page SSR shows toolbar/skeleton; row paint is client-side after `/api/users`.

---

## Files Created / Modified

- `components/backoffice/users/users-columns.tsx` (created)
- `components/backoffice/users/users-table.tsx` (created)
- `app/(backoffice)/backoffice/users/page.tsx` (modified)
- `components/data-table/index.ts` (modified — export `DataTableColumnHeader`)
