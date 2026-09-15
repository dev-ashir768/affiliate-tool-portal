### Task 4: Client service + React Query hooks

**Files:**
- Create: `services/users.ts`
- Create: `hooks/use-users.ts`

**Interfaces:**
- Consumes: `UsersListParams`, `UsersListResponse`, `UsersExportParams`
- Produces: `fetchUsers`, `exportUsers`, `useUsersQuery`, `useExportUsers`

- [ ] **Step 1: Service**

```ts
// services/users.ts
import type {
  UsersExportParams,
  UsersListParams,
  UsersListResponse,
} from "@/types/users";

function toQuery(params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

export async function fetchUsers(
  params: UsersListParams,
  signal?: AbortSignal,
): Promise<UsersListResponse> {
  const qs = toQuery(params);
  const res = await fetch(`/api/users?${qs}`, { signal });
  if (!res.ok) throw new Error("Unable to load users");
  return res.json() as Promise<UsersListResponse>;
}

export async function exportUsers(params: UsersExportParams): Promise<Blob> {
  const qs = toQuery(params);
  const res = await fetch(`/api/users/export?${qs}`);
  if (!res.ok) throw new Error("Unable to export users");
  return res.blob();
}
```

- [ ] **Step 2: Hooks**

```ts
// hooks/use-users.ts
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { exportUsers, fetchUsers } from "@/services/users";
import type { UsersExportParams, UsersListParams } from "@/types/users";

export function useUsersQuery(params: UsersListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: ({ signal }) => fetchUsers(params, signal),
    placeholderData: (prev) => prev,
  });
}

export function useExportUsers() {
  return useMutation({
    mutationFn: (params: UsersExportParams) => exportUsers(params),
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add services/users.ts hooks/use-users.ts
git commit -m "feat: add users service and React Query hooks"
```

---

