# Slice 1 Task 5 Report: Portal BFF navigation + useNavigation

**Status:** DONE_WITH_CONCERNS  
**Date:** 2026-09-17  
**Branch:** feat/saas-slice-1-platform-nav  
**BASE:** 58348541018914430c756de0d32bba065fedc604  
**Commit:** bb86fb765bb969e7a90b1599f68a6f79a883118f — feat: load navigation from API BFF instead of static JSON

---

## Summary

Replaced static `/data/navigation/:area.json` fetches with a cookie-auth BFF that proxies to `GET /api/v1/navigation/:area`. Extended `MeResponse` with `platformMembership` + `redirectTo`, and mapped seed icons `CreditCard`, `Building2`, `BadgeDollarSign` in `nav-icon.tsx`.

---

## Steps Completed

### Step 1: BFF route

Created `app/api/navigation/[area]/route.ts`:
- Validates area ∈ `dashboard` | `backoffice`
- Reads access token via `getAccessToken()`
- Proxies with `apiFetch(..., { accessToken })`
- Maps `ApiClientError` like `/api/auth/me`

### Step 2: Service + hook

- Created `services/navigation.ts` → `fetchNavigation(area)` to `/api/navigation/${area}` with `credentials: "include"`
- Updated `hooks/use-navigation.ts` to use the service (no static JSON)

### Step 3: Types + icons

- `types/auth.ts`: `PlatformMembership`, `platformMembership`, `redirectTo`; `currentOrganizationId` nullable for staff-only sessions
- `nav-icon.tsx`: added CreditCard, Building2, BadgeDollarSign

### Step 4: Commit

```text
bb86fb7 feat: load navigation from API BFF instead of static JSON
```

5 files changed, 79 insertions(+), 9 deletions(-)

---

## Test Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass |
| Manual merchant dashboard shell | **Not verified** — API `npm run dev` fails Zod env (`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` < 32 chars) |

---

## Concerns

1. **API not running** — cannot smoke-test BFF → API nav end-to-end until JWT secrets in `affiliate-tool-apis` `.env` are fixed (≥32 chars).
2. **Static JSON** left unused under `public/data/navigation/` (preferred per brief).
3. Login BFF still omits `redirectTo` / `platformMembership` (Task 6).

---

## Files

- Created: `app/api/navigation/[area]/route.ts`, `services/navigation.ts`
- Modified: `hooks/use-navigation.ts`, `types/auth.ts`, `components/layout/nav-icon.tsx`
