# Slice 2 Task 4 Spec Review: Accept invite

**Verdict:** APPROVED  
**Date:** 2026-09-17  
**Reviewed:** report `slice2-task-4-report.md` vs plan Task 4 + brief + implementation

---

## Checklist

| Requirement | Status |
|-------------|--------|
| BFF `POST /api/orgs/invites/[token]/accept` → `/api/v1/orgs/invites/:token/accept` | Pass |
| Zod body `{ password?, name? }`; stub path requires both when no session | Pass (`route.ts:41–56`) |
| Optional Bearer via `getAccessToken` when cookie present | Pass (`route.ts:41,67`) |
| `ApiClientError` mapping like other org BFF routes | Pass (`route.ts:77–89`) |
| Auth-layout page `/invite/[token]` + `AcceptInviteForm` | Pass |
| New user: name + password form; logged-in invitee: Bearer-only accept | Pass |
| Success → `/login` (no session) or `/home` (session); no tokens from API | Pass (`route.ts:70–71`) |
| types / validations / services / hook extended | Pass |
| Commit message matches plan | Pass (`6fccc97`) |

## Notes (non-blocking)

- Form calls `acceptInvite` service directly; `useAcceptInvite` exists but unused — fine.
- Existing invitees without session see new-user form until login (`?next=/invite/{token}`) — matches API 401 contract; documented in report.
- No live invite-token smoke; `tsc --noEmit` pass sufficient for this step.
- No file:line fixes required.
