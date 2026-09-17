# Slice 2 Task 3 Spec Review: Team page + invites

**Verdict:** APPROVED  
**Date:** 2026-09-17  
**Reviewed:** report `slice2-task-3-report.md` vs plan Task 3 + implementation

---

## Checklist

| Requirement | Status |
|-------------|--------|
| BFF `POST /api/orgs/current/invites` → `/api/v1/orgs/current/invites` | Pass |
| Zod body `{ email, role: ADMIN \| MEMBER }` | Pass |
| Response pass-through `{ inviteToken, membership }` | Pass |
| `ApiClientError` mapping like other org BFF routes | Pass |
| `createInvite` in `services/orgs.ts` + validations/types | Pass |
| Members DataTable via `useMembersQuery` (search/sort/page); no export | Pass |
| Columns: name, email, role, status | Pass |
| Invite dialog OWNER/ADMIN only (`useMe` orgRole); MEMBER hidden | Pass |
| Success: copyable `${origin}/invite/${inviteToken}` shown once | Pass |
| Team page wires table + invite CTA | Pass |
| Commit message matches plan | Pass (`4cb7f08`) |

## Notes (non-blocking)

- Invite CTA hidden while `useMe` loading (report concern); brief allows hide.
- Accept route is Task 4 — expected 404 until then.
- No live session smoke; `tsc --noEmit` pass sufficient for this step.
- No file:line fixes required.
