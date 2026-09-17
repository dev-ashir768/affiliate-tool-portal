# Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH

**Status:** DONE  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-2-merchant-team  
**BASE:** e084c40eb2b162ee9b23eea1ad8a201cf94ace38  
**Commit:** 4dddcb7 — feat: add org current BFF with authenticated fetch helper

---

## Summary

Added shared `authenticatedApiFetch` (cookie access token → upstream `apiFetch`) and BFF `GET`/`PATCH` `/api/orgs/current` proxying to `/api/v1/orgs/current`, with Zod PATCH `{ name }` and `ApiClientError` mapping matching `/api/auth/me`.

---

## Steps Completed

### Step 1: `authenticatedApiFetch`

Created `lib/api/authenticated-fetch.ts`:
- Reads access token via `getAccessToken()`
- Throws `ApiClientError(401, "UNAUTHORIZED", ...)` when missing
- Delegates to `apiFetch` with `accessToken`

### Step 2: Types + validations

- `types/orgs.ts` — `OrganizationCurrent` matching API `getCurrent` / `patchCurrent` shape
- `validations/org.validations.ts` — `patchCurrentOrgSchema` (`name` trimmed, min 1)

### Step 3: BFF route

Created `app/api/orgs/current/route.ts`:
- `GET` → `authenticatedApiFetch("/api/v1/orgs/current")`
- `PATCH` → validate body, then PATCH upstream with `{ name }`
- Maps `ApiClientError` → `{ error: { code, message, details } }` + status
- Validation failures → `400 VALIDATION_ERROR` with flatten details

### Step 4: Commit

```text
4dddcb7 feat: add org current BFF with authenticated fetch helper
```

4 files changed, 102 insertions(+)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual GET/PATCH smoke | Not run — no authenticated session exercise in this task |

---

## Concerns

1. No end-to-end smoke against a live API session in this task (helper + route only).
2. PATCH zod details use `flatten()`; confirm client forms expect that shape when wiring settings UI later.

---

## Files Touched

| Path | Action |
|------|--------|
| `lib/api/authenticated-fetch.ts` | Created |
| `types/orgs.ts` | Created |
| `validations/org.validations.ts` | Created |
| `app/api/orgs/current/route.ts` | Created |
