# Slice 2 Task 2 — Members list BFF + client hooks

## Goal
BFF GET members with in-memory search/sort/page; client `services/orgs.ts` + React Query hooks.

## Workspace
`d:\tiksly\affiliate-tool\affiliate-tool-portal`
Branch: `feat/saas-slice-2-merchant-team`

## Files
- Create: `app/api/orgs/current/members/route.ts`
- Create: `services/orgs.ts`
- Create: `hooks/use-members.ts`
- Create: `hooks/use-org.ts`
- Extend: `types/orgs.ts` with OrgMember, MembersListParams, MembersListResponse

## Types
```ts
export type OrgMember = {
  id: string; // membership id
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "INVITED" | "ACTIVE" | "DISABLED";
  name: string;
  email: string;
  userId: string;
};

export type MembersListParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: "name" | "email" | "role" | "status";
  sortOrder?: "asc" | "desc";
};

export type MembersListResponse = {
  data: OrgMember[];
  meta: { total: number; page: number; pageSize: number };
};
```

## BFF GET
1. `authenticatedApiFetch<{ members: Array<...> }>("/api/v1/orgs/current/members")`
2. Map nested `user` → flat OrgMember
3. Apply search/sort/page in memory
4. Error mapping like `/api/orgs/current` / `/api/auth/me`

## Client
- `services/orgs.ts`: fetch current org, patch org, list members (query params)
- `hooks/use-org.ts`, `hooks/use-members.ts`: React Query (match existing hooks style)

## Commit
```
feat: add members list BFF and React Query hooks
```

## Report
Write `d:\tiksly\affiliate-tool\affiliate-tool-portal\.superpowers\sdd\slice2-task-2-report.md`
