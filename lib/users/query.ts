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
