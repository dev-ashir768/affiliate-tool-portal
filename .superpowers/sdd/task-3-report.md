# Task 3 Report: Mock API routes (list + export)

**Status:** DONE  
**Date:** 2026-09-14  
**Branch:** feat/shopify-app-shell  
**Commit:** 194bfa4 — feat: add mock users list and export API routes

---

## Summary

Added two Next.js App Router API routes that expose the Task 2 mock user data: a paginated JSON list endpoint and a CSV/XLSX export endpoint with filter/sort support.

---

## Steps Completed

### Step 1: List route

Created `app/api/users/route.ts`:

- `GET /api/users` with query params: `page`, `pageSize`, `search`, `sortBy`, `sortOrder`
- Parses params with safe defaults (page 1, pageSize 20)
- 400 ms artificial delay for loading-state demo
- Delegates to `filterSortPaginateUsers(MOCK_USERS, params)`
- Returns JSON `{ data, meta }`

### Step 2: Export route

Created `app/api/users/export/route.ts`:

- `GET /api/users/export` with query params: `format` (required: `csv` | `xlsx`), `search`, `sortBy`, `sortOrder`
- 300 ms artificial delay
- Returns 400 JSON error for invalid/missing format
- CSV: uses `usersToCsv`, `Content-Type: text/csv`, attachment `users.csv`
- XLSX: ExcelJS workbook with column headers, attachment `users.xlsx`

Both routes set `export const runtime = "nodejs"`.

### Step 3: Smoke-test routes

Used existing dev server on `http://localhost:3000` (PID 4936 already running).

| Test | Result |
|------|--------|
| `GET /api/users?page=1&pageSize=5` | 200 — JSON with 5 rows, `meta.total=100`, `meta.page=1`, `meta.pageSize=5` |
| `GET /api/users/export?format=csv` | 200 — `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="users.csv"`, valid CSV header + rows |
| `GET /api/users/export?format=xlsx` | 200 — correct spreadsheet MIME type, 10,768-byte body |
| `GET /api/users/export?format=invalid` | 400 — `{ error: "Invalid format" }` |

### Step 4: Commit

```bash
git add app/api/users/
git commit -m "feat: add mock users list and export API routes"
```

- Commit SHA: `194bfa4`
- 2 files changed, 87 insertions

---

## Self-Review

| Area | Assessment |
|------|------------|
| Brief compliance | Matches spec verbatim (parseParams, delays, headers, ExcelJS columns) |
| Type safety | Reuses `User`, `UsersListParams` from `types/users.ts` |
| Separation | Routes are thin handlers; business logic stays in `lib/users/query.ts` |
| Error handling | Export validates format; list tolerates bad numeric params via `Number.isFinite` |
| Lint | No linter errors on new files |

---

## Concerns / Notes

1. **Artificial delays** — 400 ms (list) and 300 ms (export) are intentional for UI loading demos; remove or gate behind env flag before production.
2. **No auth** — Mock endpoints are open; real API will need session/role checks.
3. **sortBy validation** — Any string is cast to `keyof User`; invalid keys silently skip sorting (inherited from query helpers).
4. **Dev server lock** — Attempted `npm run dev` failed because another instance (PID 4936) already holds port 3000; tests used existing server. No new server left running.

---

## Files Created

- `app/api/users/route.ts`
- `app/api/users/export/route.ts`
