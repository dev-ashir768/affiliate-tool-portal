# Slice 2 Task 5 — Org settings form on `/settings`

## Goal
Wire `/settings` with org name edit (OWNER/ADMIN) + read-only plan/limits/status.

## Workspace
`d:\tiksly\affiliate-tool\affiliate-tool-portal`
Branch: `feat/saas-slice-2-merchant-team`

## Files
- Create: `components/settings/org-settings-form.tsx`
- Modify: `app/(dashboard)/settings/page.tsx`

## UI
- useOrg query + usePatchOrg mutation (already from Task 2)
- Show: org name (editable OWNER/ADMIN via useMe orgRole), plan code, seatLimit, shopLimit, dailyInviteQuota, subscriptionStatus (read-only)
- MEMBER: read-only name too
- Match existing settings/dashboard form patterns
- Toast on success/error if project uses toasts

## Commit
```
feat: wire org settings form to current organization API
```

## Report
`d:\tiksly\affiliate-tool\affiliate-tool-portal\.superpowers\sdd\slice2-task-5-report.md`
