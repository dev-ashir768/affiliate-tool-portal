# Slice 2 Task 3 Report: Team DataTable + invite dialog

**Status:** DONE  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-2-merchant-team  
**BASE:** 6556b15  
**Commit:** 4cb7f08 — feat: wire dashboard Team page with members table and invites

---

## Summary

Wired `/team` with a members DataTable (search/sort/page via `useMembersQuery`, no export) and an OWNER/ADMIN-only invite dialog. Added BFF `POST /api/orgs/current/invites` that validates `{ email, role }` and proxies to `/api/v1/orgs/current/invites`, returning `{ inviteToken, membership }`. After invite, the dialog shows a one-time copyable `${origin}/invite/${inviteToken}` link.

---

## Steps Completed

### Step 1: Invites BFF POST

Created `app/api/orgs/current/invites/route.ts` with Zod validation (`createInviteSchema`), `authenticatedApiFetch` proxy, and `ApiClientError` mapping matching other org BFF routes. Extended `validations/org.validations.ts` and `types/orgs.ts` (`CreateInviteResponse`). Added `createInvite` to `services/orgs.ts`.

### Step 2: Columns + table

- `components/team/members-columns.tsx` — name, email, role, status (badge)
- `components/team/members-table.tsx` — DataTable + nuqs URL state, mirrors backoffice users (no `onExport`)

### Step 3: Invite dialog

`components/team/invite-member-dialog.tsx` — hidden unless `useMe` org role is OWNER/ADMIN; form posts invite; success state shows copyable link once; invalidates `["org", "members"]`.

### Step 4: Team page

`app/(dashboard)/team/page.tsx` — header + invite CTA + Suspense-wrapped `MembersTable`.

### Step 5: Commit

```text
4cb7f08 feat: wire dashboard Team page with members table and invites
```

8 files changed, 534 insertions(+)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual invite/table smoke | Not run — no authenticated session exercise in this task |

---

## Concerns

1. Invite button is hidden while `useMe` is loading (same as MEMBER), so OWNER/ADMIN briefly see no CTA until me resolves.
2. Accept-invite page (`/invite/[token]`) is Task 4 — generated links will 404 until then.
3. No live session smoke against POST invites in this task.

---

## Files Touched

| Path | Action |
|------|--------|
| `app/api/orgs/current/invites/route.ts` | Created |
| `components/team/members-columns.tsx` | Created |
| `components/team/members-table.tsx` | Created |
| `components/team/invite-member-dialog.tsx` | Created |
| `app/(dashboard)/team/page.tsx` | Modified |
| `services/orgs.ts` | Extended |
| `types/orgs.ts` | Extended |
| `validations/org.validations.ts` | Extended |
