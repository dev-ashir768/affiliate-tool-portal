# Slice 2 Task 2 Report: Members list BFF + client hooks

**Status:** DONE  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-2-merchant-team  
**BASE:** 4dddcb7  
**Commit:** 6556b15 — feat: add members list BFF and React Query hooks

---

## Summary

Added BFF `GET /api/orgs/current/members` that proxies upstream members, flattens nested `user` into `OrgMember`, and applies in-memory search/sort/pagination. Wired client `services/orgs.ts` plus React Query hooks `useOrg` / `usePatchOrg` / `useMembersQuery`.

---

## Steps Completed

### Step 1: Types

Extended `types/orgs.ts` with `OrgMember`, `OrgMemberRole`, `OrgMemberStatus`, `MembersListParams`, `MembersListResponse`.

### Step 2: BFF route

Created `app/api/orgs/current/members/route.ts`:
- `authenticatedApiFetch<{ members }>` → `/api/v1/orgs/current/members`
- Maps `{ id, role, status, user }` → flat `OrgMember` (`userId`, `name`, `email`)
- Query params: `page`, `pageSize`, `search`, `sortBy`, `sortOrder` (same defaults/shape as users list)
- Search across name/email/role/status; sort by allowed fields; paginate with `meta`
- `ApiClientError` mapping matches `/api/orgs/current`

### Step 3: Client services + hooks

- `services/orgs.ts` — `fetchCurrentOrg`, `patchCurrentOrg`, `fetchMembers`
- `hooks/use-org.ts` — `useOrg`, `usePatchOrg` (cache update on success)
- `hooks/use-members.ts` — `useMembersQuery(params)` with `placeholderData`

### Step 4: Commit

```text
6556b15 feat: add members list BFF and React Query hooks
```

5 files changed, 243 insertions(+)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual members smoke | Not run — no authenticated session exercise in this task |

---

## Concerns

1. In-memory search/sort/page loads the full upstream members list each request; fine for seat-limited orgs, may need API-side paging later.
2. No live session smoke against `/api/v1/orgs/current/members` in this task.

---

## Files Touched

| Path | Action |
|------|--------|
| `types/orgs.ts` | Extended |
| `app/api/orgs/current/members/route.ts` | Created |
| `services/orgs.ts` | Created |
| `hooks/use-org.ts` | Created |
| `hooks/use-members.ts` | Created |
