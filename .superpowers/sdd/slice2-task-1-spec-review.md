# Slice 2 Task 1 Spec Review: Org current BFF

**Verdict:** APPROVED  
**Date:** 2026-09-17  
**Reviewed:** report `slice2-task-1-report.md` vs plan Task 1 + implementation

---

## Checklist

| Requirement | Status |
|-------------|--------|
| `authenticatedApiFetch` matches plan (token → throw 401 → `apiFetch`) | Pass |
| `OrganizationCurrent` matches plan interface | Pass |
| `GET`/`PATCH` `/api/orgs/current` → `/api/v1/orgs/current` | Pass |
| PATCH `{ name }` via zod (`patchCurrentOrgSchema`) | Pass |
| `ApiClientError` → `{ error: { code, message, details } }` like `/api/auth/me` | Pass |
| Commit message matches plan | Pass (`4dddcb7`) |

## Error handling vs `app/api/auth/me/route.ts`

- Catch blocks are identical (`ApiClientError` → same JSON + status; else `500 INTERNAL`).
- Missing token: `me` early-returns 401; org throws `ApiClientError(401, …)` from the helper then maps in catch — response shape equivalent (`details` omitted when undefined).

## Notes (non-blocking)

- Manual smoke not run (report concern); plan allowed manual/thin test; `tsc --noEmit` pass is enough for this slice step.
- No file:line fixes required.
