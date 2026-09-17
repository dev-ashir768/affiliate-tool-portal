# Slice 2 Task 4 Report: Accept invite page + BFF

**Status:** DONE  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-2-merchant-team  
**BASE:** 4cb7f08  
**Commit:** 6fccc97 — feat: add accept-invite page and BFF

---

## Summary

Added auth-layout `/invite/[token]` with an accept form and BFF `POST /api/orgs/invites/[token]/accept` → `/api/v1/orgs/invites/:token/accept`. Body is optional `{ password?, name? }`; when no session cookie, BFF requires both (stub path). If an access cookie exists, it is forwarded as Bearer. API returns membership + user only (no tokens), so BFF sets `redirectTo` to `/home` when session present else `/login`. Logged-in invitees get a one-click accept; anonymous users get name + password matching login/signup card patterns.

---

## Steps Completed

### Step 1: Contract check

API `acceptInvite` activates membership; stubs need password+name; existing users need Bearer matching invitee. Response: `{ membership, user }` — no access/refresh tokens.

### Step 2: BFF + types/validation/service/hook

- `app/api/orgs/invites/[token]/accept/route.ts` — Zod, optional `getAccessToken` Bearer, error mapping like other org BFFs
- Extended `validations/org.validations.ts`, `types/orgs.ts` (`AcceptInviteResponse`), `services/orgs.ts` (`acceptInvite`)
- `hooks/use-accept-invite.ts`

### Step 3: UI

- `app/(auth)/invite/[token]/page.tsx` under auth layout
- `components/invites/accept-invite-form.tsx` — session via `useMe`; new-user form or accept button; success → `/login` or `/home`

### Step 4: Commit

```text
6fccc97 feat: add accept-invite page and BFF
```

7 files changed, 426 insertions(+)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual accept-invite smoke | Not run — no live invite token exercise in this task |

---

## Concerns

1. Accept does not issue session tokens; new users must log in after accepting (API contract).
2. Existing invitees who are not logged in see the new-user form; API returns 401 until they log in (link includes `?next=/invite/{token}`).
3. Wrong logged-in account → API 403; form shows error + switch-account link.
4. No end-to-end smoke against a real invite token in this task.

---

## Files Touched

| Path | Action |
|------|--------|
| `app/api/orgs/invites/[token]/accept/route.ts` | Created |
| `app/(auth)/invite/[token]/page.tsx` | Created |
| `components/invites/accept-invite-form.tsx` | Created |
| `hooks/use-accept-invite.ts` | Created |
| `services/orgs.ts` | Extended |
| `types/orgs.ts` | Extended |
| `validations/org.validations.ts` | Extended |
