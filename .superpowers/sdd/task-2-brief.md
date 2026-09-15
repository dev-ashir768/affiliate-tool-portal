### Task 2: Users types, mock data, and query helpers

**Files:**
- Create: `types/users.ts`
- Create: `lib/users/mock-data.ts`
- Create: `lib/users/query.ts`
- Create: `lib/users/query.selfcheck.ts`
- Test: `lib/users/query.selfcheck.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `User`, `UsersListParams`, `UsersListResponse`, `UsersExportParams`, `UsersExportFormat`
  - `filterSortPaginateUsers(users, params): UsersListResponse`
  - `usersToCsv(users: User[]): string`
  - `MOCK_USERS: User[]` (~100 rows)

- [ ] **Step 1: Write types**

```ts
// types/users.ts
export type UserRole = "admin" | "manager" | "viewer";
export type UserStatus = "active" | "invited" | "disabled";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  shop: string;
  createdAt: string;
};

export type UsersListParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
};

export type UsersListResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

export type UsersExportFormat = "csv" | "xlsx";

export type UsersExportParams = {
  format: UsersExportFormat;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
};
```

- [ ] **Step 2: Write mock dataset**

```ts
// lib/users/mock-data.ts
import type { User, UserRole, UserStatus } from "@/types/users";

const roles: UserRole[] = ["admin", "manager", "viewer"];
const statuses: UserStatus[] = ["active", "invited", "disabled"];
const shops = ["Acme Co", "Globex", "Initech", "Umbrella", "Stark Industries"];

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export const MOCK_USERS: User[] = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  return {
    id: `usr_${pad(n)}`,
    name: `User ${pad(n)}`,
    email: `user${n}@example.com`,
    role: roles[i % roles.length]!,
    status: statuses[i % statuses.length]!,
    shop: shops[i % shops.length]!,
    createdAt: new Date(Date.UTC(2024, i % 12, (i % 28) + 1)).toISOString(),
  };
});
```

- [ ] **Step 3: Write query helpers**

```ts
// lib/users/query.ts
import type { User, UsersListParams, UsersListResponse } from "@/types/users";

const SEARCH_FIELDS: (keyof User)[] = ["name", "email", "role", "status", "shop"];

export function filterUsers(users: User[], search?: string): User[] {
  const q = search?.trim().toLowerCase();
  if (!q) return users;
  return users.filter((u) =>
    SEARCH_FIELDS.some((field) => String(u[field]).toLowerCase().includes(q)),
  );
}

export function sortUsers(
  users: User[],
  sortBy?: keyof User,
  sortOrder?: "asc" | "desc",
): User[] {
  if (!sortBy || !sortOrder) return users;
  const dir = sortOrder === "asc" ? 1 : -1;
  return [...users].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

export function filterSortPaginateUsers(
  users: User[],
  params: UsersListParams,
): UsersListResponse {
  const filtered = filterUsers(users, params.search);
  const sorted = sortUsers(filtered, params.sortBy, params.sortOrder);
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const start = (page - 1) * pageSize;
  const data = sorted.slice(start, start + pageSize);
  return {
    data,
    meta: { total: sorted.length, page, pageSize },
  };
}

export function usersToCsv(users: User[]): string {
  const headers = ["id", "name", "email", "role", "status", "shop", "createdAt"];
  const escape = (v: string) => {
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const lines = [
    headers.join(","),
    ...users.map((u) =>
      headers.map((h) => escape(String(u[h as keyof User]))).join(","),
    ),
  ];
  return lines.join("\n");
}
```

- [ ] **Step 4: Write and run selfcheck**

```ts
// lib/users/query.selfcheck.ts
import { MOCK_USERS } from "./mock-data";
import { filterSortPaginateUsers, usersToCsv } from "./query";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const page1 = filterSortPaginateUsers(MOCK_USERS, { page: 1, pageSize: 20 });
assert(page1.data.length === 20, "page size 20");
assert(page1.meta.total === 100, "total 100");

const searched = filterSortPaginateUsers(MOCK_USERS, {
  page: 1,
  pageSize: 20,
  search: "user1@",
});
assert(searched.meta.total >= 1, "search finds rows");

const sorted = filterSortPaginateUsers(MOCK_USERS, {
  page: 1,
  pageSize: 5,
  sortBy: "name",
  sortOrder: "desc",
});
assert(sorted.data[0]!.name >= sorted.data[1]!.name, "desc sort");

const csv = usersToCsv(page1.data);
assert(csv.startsWith("id,name,email"), "csv header");

console.log("lib/users/query.selfcheck: ok");
```

Run:

```bash
npx tsx lib/users/query.selfcheck.ts
```

Expected: `lib/users/query.selfcheck: ok`

- [ ] **Step 5: Commit**

```bash
git add types/users.ts lib/users/
git commit -m "feat: add users types, mock data, and list query helpers"
```

---

