# Slice 2 Task 2 Spec Review: Members BFF + hooks

**Verdict:** APPROVED  
**Date:** 2026-09-17  
**Reviewed:** report `slice2-task-2-report.md` vs plan Task 2 + implementation

---

## Checklist

| Requirement | Status |
|-------------|--------|
| Types: `OrgMember`, `MembersListParams`, `MembersListResponse` match plan | Pass |
| BFF GET → `authenticatedApiFetch` `/api/v1/orgs/current/members` | Pass |
| Map nested `user` → flat `OrgMember` (`userId`, `name`, `email`) | Pass |
| In-memory search/sort/page (users-list adapter pattern) | Pass |
| `ApiClientError` mapping like `/api/orgs/current` | Pass |
| `services/orgs.ts`: fetch/patch org + `fetchMembers` with query params | Pass |
| `useOrg` / `usePatchOrg` / `useMembersQuery` match existing RQ style | Pass |
| Commit message matches plan | Pass (`6556b15`) |

## Notes (non-blocking)

- In-memory full-list paging (report concern) is explicitly allowed by plan.
- Manual session smoke not run; `tsc --noEmit` pass sufficient for this step.
- No file:line fixes required.
