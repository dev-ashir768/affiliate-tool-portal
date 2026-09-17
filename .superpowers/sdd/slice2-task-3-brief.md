# Slice 2 Task 3 — Team page DataTable + invite dialog

## Goal
Wire dashboard `/team` with members DataTable + invite dialog; POST invites BFF.

## Workspace
`d:\tiksly\affiliate-tool\affiliate-tool-portal`
Branch: `feat/saas-slice-2-merchant-team`

## Files
- Create: `components/team/members-columns.tsx`
- Create: `components/team/members-table.tsx`
- Create: `components/team/invite-member-dialog.tsx`
- Create: `app/api/orgs/current/invites/route.ts`
- Extend: `services/orgs.ts` (createInvite), validations if needed
- Modify: `app/(dashboard)/team/page.tsx`

## Invite BFF POST
- Path: `/api/orgs/current/invites` → `/api/v1/orgs/current/invites`
- Body: `{ email, role: "ADMIN" | "MEMBER" }` (Zod)
- Returns: `{ inviteToken, membership }` (pass through API shape)
- Error mapping like other org BFF routes

## UI
- Reuse DataTable pattern from backoffice users (search/sort/page via useMembersQuery)
- No export required in v1
- Invite dialog: OWNER/ADMIN only (disable/hide for MEMBER via useMe orgRole)
- After invite: show copyable link `${origin}/invite/${inviteToken}` once
- Columns: name, email, role, status (at minimum)

## Commit
```
feat: wire dashboard Team page with members table and invites
```

## Report
`d:\tiksly\affiliate-tool\affiliate-tool-portal\.superpowers\sdd\slice2-task-3-report.md`
