# Slice 1 Task 6 Report: Login redirectTo + proxy area guards

**Status:** DONE_WITH_CONCERNS  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-1-platform-nav  
**BASE:** bb86fb765bb969e7a90b1599f68a6f79a883118f  
**Commit:** 682fd15c0402127d96971008e19c4a6703b5e6ba — feat: role-based login redirect and proxy area guards

---

## Summary

Login/register BFF now forwards `redirectTo` (and `platformMembership`). Login form validates `next` by role via `resolvePostAuthRedirect`. Proxy decodes access JWT claims and enforces `/backoffice/*` vs dashboard area guards, including staff-only → `/backoffice/users` and merchant away from backoffice.

---

## Steps Completed

### Step 1: `readAccessClaims` + env note

Created `lib/auth/access-token.ts` with decode-only JWT payload reader and redirect helpers. Trust boundary documented in file comments (httpOnly cookie set only by BFF; API still verifies).

`.env.example` updated locally with optional `JWT_ACCESS_SECRET` comment — **not committed** (repo `.gitignore` has `.env*`).

### Step 2: BFF + forms

- `app/api/auth/login/route.ts` — pass through `redirectTo`, `platformMembership`, nullable `organizationId`
- `app/api/auth/register/route.ts` — pass through `redirectTo` (default `/home`)
- `login-form.tsx` — `next` validated for staff (backoffice only) / merchant (non-backoffice); else `payload.redirectTo`
- `signup-form.tsx` — uses `payload.redirectTo` or `/home`

### Step 3: `proxy.ts` area checks

After token present/refresh:
- `/backoffice/*` requires `platformRole`; else redirect `/home`
- Dashboard prefixes require `orgId`; staff-only (`platformRole && !orgId`) → `/backoffice/users`
- Auth pages with session → role default redirect

### Step 4: Manual E2E

Not run end-to-end (API env/JWT secrets may still block; see concerns).

### Step 5: Commit

```text
682fd15 feat: role-based login redirect and proxy area guards
```

6 files changed, 216 insertions(+), 24 deletions(-)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual E2E (staff/merchant redirects) | **Not verified** |

---

## Concerns

1. **`.env.example` not in commit** — ignored by `.env*`; decode-only approach documented in `access-token.ts` instead.
2. **Manual E2E not run** — area guards rely on live login + cookies; typecheck only.
3. Login form falls back to inferring staff from `redirectTo` if `platformMembership` missing (defensive).

---

## Files

- Created: `lib/auth/access-token.ts`
- Modified: `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`, `components/auth/login-form.tsx`, `components/auth/signup-form.tsx`, `proxy.ts`
- Local only: `.env.example`
