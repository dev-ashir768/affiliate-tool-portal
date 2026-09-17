# Slice 2 Task 4 — Accept invite page

## Goal
BFF accept-invite + `/invite/[token]` UI under auth layout.

## Workspace
`d:\tiksly\affiliate-tool\affiliate-tool-portal`
Branch: `feat/saas-slice-2-merchant-team`

## Files
- Create: `app/api/orgs/invites/[token]/accept/route.ts`
- Create: `app/(auth)/invite/[token]/page.tsx`
- Create: `components/invites/accept-invite-form.tsx`
- Extend services/hooks/types/validations as needed

## BFF POST
- `/api/orgs/invites/[token]/accept` → `/api/v1/orgs/invites/:token/accept`
- Body: `{ password?, name? }` (Zod — optional fields)
- Forward cookie access token via `getAccessToken` if present (existing user logged in as invitee: Bearer only)
- Stub/new-user path: password + name required (validate when no session, or when API requires)
- Error mapping like other org BFF routes
- Check API accept endpoint in affiliate-tool-apis for exact contract

## UI
- Auth layout page at `/invite/[token]`
- Form: name + password for new users; if already logged in as invitee, may accept with Bearer only
- On success → login or `/home` (match product sense: if tokens returned, set session; else redirect login)

## Commit
```
feat: add accept-invite page and BFF
```

## Report
`d:\tiksly\affiliate-tool\affiliate-tool-portal\.superpowers\sdd\slice2-task-4-report.md`
