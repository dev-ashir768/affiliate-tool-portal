# Task 4 Report: Client service + React Query hooks

**Status:** DONE  
**Date:** 2026-09-14  
**Branch:** feat/shopify-app-shell  
**Commit:** 9a9d211 — feat: add users service and React Query hooks

---

## Summary

Added a client-side users service and React Query hooks that consume the Task 3 mock API routes (`/api/users`, `/api/users/export`).

---

## Steps Completed

### Step 1: Service

Created `services/users.ts`:

- `toQuery` helper — serializes params, skipping `undefined`, `null`, and empty strings
- `fetchUsers(params, signal?)` — GET `/api/users?…`, throws on non-OK, returns `UsersListResponse`
- `exportUsers(params)` — GET `/api/users/export?…`, throws on non-OK, returns `Blob`

### Step 2: Hooks

Created `hooks/use-users.ts`:

- `useUsersQuery(params)` — `useQuery` with key `["users", params]`, passes AbortSignal, `placeholderData: (prev) => prev` for pagination UX
- `useExportUsers()` — `useMutation` wrapping `exportUsers`

### Step 3: Commit

```bash
git add services/users.ts hooks/use-users.ts
git commit -m "feat: add users service and React Query hooks"
```

- Commit SHA: `9a9d211`
- 2 files changed, 50 insertions

---

## Self-Review

| Area | Assessment |
|------|------------|
| Brief compliance | Matches spec verbatim |
| Pattern alignment | Mirrors `use-navigation.ts` (React Query + typed fetch); service extracted to `services/` per brief |
| Type safety | Imports `UsersListParams`, `UsersListResponse`, `UsersExportParams` from `types/users.ts` |
| Abort support | List query forwards React Query's `signal` for request cancellation |
| Pagination UX | `placeholderData` keeps prior page visible while fetching next page |
| Lint / types | ESLint clean; `tsc --noEmit` passes |

---

## Test Summary

| Test | Result |
|------|--------|
| `npx tsc --noEmit` | Pass |
| `npm run lint` | Pass |
| IDE linter (new files) | No errors |

No runtime smoke test — dev server not running; hooks are thin wrappers over verified Task 3 API routes.

---

## Concerns / Notes

1. **Export mutation has no download helper** — Callers must trigger blob download (createObjectURL + anchor click); likely handled in Task 5 UI layer.
2. **No retry/error toast config** — Uses React Query defaults; UI may want custom `onError` handling.
3. **Query key includes full params object** — Correct for cache isolation; ensure callers pass stable param references or memoized objects to avoid unnecessary refetches.

---

## Files Created

- `services/users.ts`
- `hooks/use-users.ts`
