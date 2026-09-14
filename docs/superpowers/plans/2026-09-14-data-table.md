# Production DataTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a reusable server-driven DataTable (TanStack Table v9 + shadcn) with URL state, Zustand column preferences, mock Users list/export APIs, and a working Backoffice Users demo page.

**Architecture:** Controlled `DataTable<TData>` owns presentation + TanStack UI state (visibility/order/sizing). Pages own URL (`nuqs`) and data (`React Query` → `services/*` → Next mock `app/api/*`). Preferences persist in one Zustand store keyed by `tableId`.

**Tech Stack:** Next.js 16 App Router, React 19, `@tanstack/react-table` v9 (`useTable` + `tableFeatures`), `@tanstack/react-query` v5, `nuqs`, `zustand`, `@hello-pangea/dnd`, `exceljs`, shadcn/ui (base-nova).

**Spec:** `docs/superpowers/specs/2026-09-14-data-table-design.md`

## Global Constraints

- Use TanStack Table **v9** APIs only: `useTable`, `tableFeatures`, feature imports — never `useReactTable` / v8 option names.
- Server-side pagination/sort/search only; never load the full dataset for table rendering.
- Export goes through `/api/users/export` (mock blob), not client-only page dump.
- shadcn-first UI; colors via CSS variable / token classes only.
- No Jest/Vitest — use tiny `tsx` selfcheck scripts for pure helpers.
- Follow approved file list; no row selection, column filters, or toasts in v1.
- Prefer fewest files that still match the spec layout.

---

## File structure

| Path | Responsibility |
|------|----------------|
| `types/users.ts` | `User`, list/export params + responses |
| `lib/users/mock-data.ts` | Seed users dataset |
| `lib/users/query.ts` | Pure filter/sort/paginate + CSV helpers |
| `lib/users/query.selfcheck.ts` | Assert script for query helpers |
| `app/api/users/route.ts` | `GET` list mock |
| `app/api/users/export/route.ts` | `GET` CSV/XLSX export mock |
| `services/users.ts` | Client fetch wrappers |
| `hooks/use-users.ts` | React Query list + export mutation helper |
| `components/data-table/types.ts` | Shared DataTable prop/state types + features type |
| `components/data-table/store/data-table-preferences-store.ts` | Zustand persist |
| `components/data-table/hooks/use-data-table-preferences.ts` | Per-`tableId` preferences API |
| `components/data-table/utils/export-download.ts` | Trigger browser download from Blob |
| `components/data-table/utils/pagination.ts` | Page-number range helper + selfcheck |
| `components/data-table/data-table-empty.tsx` | Empty state |
| `components/data-table/data-table-error.tsx` | Error state |
| `components/data-table/data-table-skeleton.tsx` | Skeleton rows |
| `components/data-table/data-table-column-header.tsx` | Sortable header + drag handle |
| `components/data-table/data-table-column-visibility.tsx` | Columns dropdown |
| `components/data-table/data-table-pagination.tsx` | Footer pagination UI |
| `components/data-table/data-table-export.tsx` | Export CSV/Excel menu |
| `components/data-table/data-table-toolbar.tsx` | Search + actions |
| `components/data-table/data-table.tsx` | Main controlled table |
| `components/data-table/index.ts` | Public exports |
| `components/backoffice/users/users-columns.tsx` | Users column defs |
| `components/backoffice/users/users-table.tsx` | Wire URL + query + DataTable |
| `app/(backoffice)/backoffice/users/page.tsx` | Render `UsersTable` |
| `providers/index.tsx` | Add `NuqsAdapter` |
| `components/ui/checkbox.tsx` | shadcn add |
| `components/ui/skeleton.tsx` | shadcn add |

---

### Task 1: Dependencies, NuqsAdapter, shadcn primitives

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `providers/index.tsx`
- Create: `components/ui/checkbox.tsx` (via shadcn)
- Create: `components/ui/skeleton.tsx` (via shadcn)

**Interfaces:**
- Consumes: existing `Providers`
- Produces: `zustand`, `nuqs`, `exceljs` installed; `NuqsAdapter` wrapping app; Checkbox + Skeleton available

- [ ] **Step 1: Install packages**

```bash
npm install zustand nuqs exceljs
```

Expected: packages appear in `package.json` dependencies; install exits 0.

- [ ] **Step 2: Add shadcn Checkbox and Skeleton**

```bash
npx shadcn@latest add checkbox skeleton --yes
```

Expected: `components/ui/checkbox.tsx` and `components/ui/skeleton.tsx` exist.

- [ ] **Step 3: Wrap providers with NuqsAdapter**

```tsx
// providers/index.tsx
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import QueryProvider from "./query-provider";

type Props = { children: ReactNode };

export const Providers = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <QueryProvider>{children}</QueryProvider>
    </NuqsAdapter>
  );
};
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json providers/index.tsx components/ui/checkbox.tsx components/ui/skeleton.tsx
git commit -m "chore: add zustand, nuqs, exceljs, and DataTable UI primitives"
```

---

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

### Task 3: Mock API routes (list + export)

**Files:**
- Create: `app/api/users/route.ts`
- Create: `app/api/users/export/route.ts`

**Interfaces:**
- Consumes: `MOCK_USERS`, `filterSortPaginateUsers`, `filterUsers`, `sortUsers`, `usersToCsv`
- Produces: `GET /api/users`, `GET /api/users/export`

- [ ] **Step 1: List route**

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/users/mock-data";
import { filterSortPaginateUsers } from "@/lib/users/query";
import type { User, UsersListParams } from "@/types/users";

export const runtime = "nodejs";

function parseParams(url: URL): UsersListParams {
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const search = url.searchParams.get("search") ?? undefined;
  const sortBy = (url.searchParams.get("sortBy") as keyof User | null) ?? undefined;
  const sortOrder =
    (url.searchParams.get("sortOrder") as "asc" | "desc" | null) ?? undefined;
  return {
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    search: search || undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  };
}

export async function GET(req: NextRequest) {
  await new Promise((r) => setTimeout(r, 400));
  const result = filterSortPaginateUsers(MOCK_USERS, parseParams(req.nextUrl));
  return NextResponse.json(result);
}
```

- [ ] **Step 2: Export route**

```ts
// app/api/users/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { MOCK_USERS } from "@/lib/users/mock-data";
import { filterUsers, sortUsers, usersToCsv } from "@/lib/users/query";
import type { User } from "@/types/users";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await new Promise((r) => setTimeout(r, 300));
  const { searchParams } = req.nextUrl;
  const format = searchParams.get("format");
  const search = searchParams.get("search") ?? undefined;
  const sortBy = (searchParams.get("sortBy") as keyof User | null) ?? undefined;
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc" | null) ?? undefined;

  if (format !== "csv" && format !== "xlsx") {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }

  const rows = sortUsers(filterUsers(MOCK_USERS, search || undefined), sortBy || undefined, sortOrder || undefined);

  if (format === "csv") {
    const body = usersToCsv(rows);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="users.csv"',
      },
    });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Users");
  sheet.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 28 },
    { header: "Role", key: "role", width: 12 },
    { header: "Status", key: "status", width: 12 },
    { header: "Shop", key: "shop", width: 20 },
    { header: "Created At", key: "createdAt", width: 24 },
  ];
  sheet.addRows(rows);
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="users.xlsx"',
    },
  });
}
```

- [ ] **Step 3: Smoke-test routes**

```bash
npm run dev
```

In another shell:

```bash
curl -s "http://localhost:3000/api/users?page=1&pageSize=5" | head -c 400
curl -sI "http://localhost:3000/api/users/export?format=csv" | findstr /I "content-type content-disposition"
```

Expected: JSON with `data` + `meta`; CSV export headers present.

- [ ] **Step 4: Commit**

```bash
git add app/api/users/
git commit -m "feat: add mock users list and export API routes"
```

---

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

### Task 5: Zustand preferences store

**Files:**
- Create: `components/data-table/store/data-table-preferences-store.ts`
- Create: `components/data-table/hooks/use-data-table-preferences.ts`

**Interfaces:**
- Consumes: TanStack visibility/order/sizing state shapes
- Produces: `useDataTablePreferences(tableId)` → `{ columnVisibility, columnOrder, columnSizing, setColumnVisibility, setColumnOrder, setColumnSizing }`

- [ ] **Step 1: Store**

```ts
// components/data-table/store/data-table-preferences-store.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ColumnOrderState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table";

export type TablePreferences = {
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
};

type PreferencesState = {
  byTable: Record<string, TablePreferences>;
  setPreferences: (
    tableId: string,
    patch: Partial<TablePreferences>,
  ) => void;
};

const emptyPrefs = (): TablePreferences => ({
  columnVisibility: {},
  columnOrder: [],
  columnSizing: {},
});

export const useDataTablePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      byTable: {},
      setPreferences: (tableId, patch) =>
        set((state) => ({
          byTable: {
            ...state.byTable,
            [tableId]: {
              ...emptyPrefs(),
              ...state.byTable[tableId],
              ...patch,
            },
          },
        })),
    }),
    { name: "datatable-preferences" },
  ),
);
```

- [ ] **Step 2: Hook**

```ts
// components/data-table/hooks/use-data-table-preferences.ts
"use client";

import { useCallback } from "react";
import type {
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  VisibilityState,
} from "@tanstack/react-table";
import {
  useDataTablePreferencesStore,
  type TablePreferences,
} from "../store/data-table-preferences-store";

const empty: TablePreferences = {
  columnVisibility: {},
  columnOrder: [],
  columnSizing: {},
};

export function useDataTablePreferences(tableId: string) {
  const prefs = useDataTablePreferencesStore(
    (s) => s.byTable[tableId] ?? empty,
  );
  const setPreferences = useDataTablePreferencesStore((s) => s.setPreferences);

  const setColumnVisibility: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      const prev = prefs.columnVisibility;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnVisibility: next });
    },
    [prefs.columnVisibility, setPreferences, tableId],
  );

  const setColumnOrder: OnChangeFn<ColumnOrderState> = useCallback(
    (updater) => {
      const prev = prefs.columnOrder;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnOrder: next });
    },
    [prefs.columnOrder, setPreferences, tableId],
  );

  const setColumnSizing: OnChangeFn<ColumnSizingState> = useCallback(
    (updater) => {
      const prev = prefs.columnSizing;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPreferences(tableId, { columnSizing: next });
    },
    [prefs.columnSizing, setPreferences, tableId],
  );

  return {
    ...prefs,
    setColumnVisibility,
    setColumnOrder,
    setColumnSizing,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add components/data-table/store components/data-table/hooks
git commit -m "feat: add Zustand DataTable preferences persistence"
```

---

### Task 6: DataTable types, empty/error/skeleton, download + page helpers

**Files:**
- Create: `components/data-table/types.ts`
- Create: `components/data-table/utils/export-download.ts`
- Create: `components/data-table/utils/pagination.ts`
- Create: `components/data-table/utils/pagination.selfcheck.ts`
- Create: `components/data-table/data-table-empty.tsx`
- Create: `components/data-table/data-table-error.tsx`
- Create: `components/data-table/data-table-skeleton.tsx`
- Test: `components/data-table/utils/pagination.selfcheck.ts`

**Interfaces:**
- Consumes: TanStack types
- Produces: `DataTableProps<TData>`, `dataTableFeatures`, `downloadBlob`, `getPaginationItems`, empty/error/skeleton components

- [ ] **Step 1: Shared features + props types**

```ts
// components/data-table/types.ts
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowSortingFeature,
  rowPaginationFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableExportFormat = "csv" | "xlsx";

export type DataTableProps<TData extends Record<string, unknown>> = {
  tableId: string;
  columns: ColumnDef<DataTableFeatures, TData, unknown>[];
  data: TData[];
  totalCount: number;
  pagination: PaginationState; // pageIndex 0-based
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onExport?: (format: DataTableExportFormat) => Promise<void>;
  onRefresh?: () => void;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  pageSizeOptions?: number[];
  getRowId?: (row: TData) => string;
};
```

Note: If `ColumnDef` generic arity differs in the installed v9 build, adjust to match package types (`createColumnHelper` pattern in Task 9). Prefer compiling against installed types over guessing.

- [ ] **Step 2: Download + pagination helpers**

```ts
// components/data-table/utils/export-download.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

```ts
// components/data-table/utils/pagination.ts
export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  currentPage: number, // 1-based
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (
    let p = Math.max(1, currentPage - siblingCount);
    p <= Math.min(totalPages, currentPage + siblingCount);
    p++
  ) {
    pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}
```

```ts
// components/data-table/utils/pagination.selfcheck.ts
import { getPaginationItems } from "./pagination";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(
  JSON.stringify(getPaginationItems(1, 13)) ===
    JSON.stringify([1, 2, "ellipsis", 13]),
  "page 1",
);
assert(
  JSON.stringify(getPaginationItems(7, 13)) ===
    JSON.stringify([1, "ellipsis", 6, 7, 8, "ellipsis", 13]),
  "middle",
);
console.log("pagination.selfcheck: ok");
```

Run: `npx tsx components/data-table/utils/pagination.selfcheck.ts`

- [ ] **Step 3: Empty / Error / Skeleton**

```tsx
// components/data-table/data-table-empty.tsx
"use client";

import { Button } from "@/components/ui/button";

type Props = {
  search?: string;
  onClearSearch?: () => void;
};

export function DataTableEmpty({ search, onClearSearch }: Props) {
  const hasSearch = Boolean(search?.trim());
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">
        {hasSearch ? `No results found for "${search}"` : "No records found"}
      </p>
      {hasSearch && onClearSearch ? (
        <Button type="button" variant="outline" size="sm" onClick={onClearSearch}>
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
```

```tsx
// components/data-table/data-table-error.tsx
"use client";

import { Button } from "@/components/ui/button";

type Props = { onRetry?: () => void };

export function DataTableError({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-foreground">Something went wrong</p>
      <p className="text-sm text-muted-foreground">Unable to load data.</p>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
```

```tsx
// components/data-table/data-table-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = { columnCount?: number; rowCount?: number };

export function DataTableSkeleton({
  columnCount = 6,
  rowCount = 8,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columnCount }).map((_, c) => (
              <TableCell key={c}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/data-table/
git commit -m "feat: add DataTable types, states, and pagination helpers"
```

---

### Task 7: Toolbar pieces (header, visibility, pagination, export, toolbar)

**Files:**
- Create: `components/data-table/data-table-column-header.tsx`
- Create: `components/data-table/data-table-column-visibility.tsx`
- Create: `components/data-table/data-table-pagination.tsx`
- Create: `components/data-table/data-table-export.tsx`
- Create: `components/data-table/data-table-toolbar.tsx`

**Interfaces:**
- Consumes: TanStack `Table` instance / column APIs, `getPaginationItems`
- Produces: toolbar subcomponents used by `DataTable`

- [ ] **Step 1: Column header (sort cycle + drag handle)**

Implement a header button that calls `column.toggleSorting()` in a way that cycles **none → asc → desc → none**. With TanStack, prefer:

```ts
const sorted = column.getIsSorted();
if (sorted === false) column.toggleSorting(false); // asc
else if (sorted === "asc") column.toggleSorting(true); // desc
else column.clearSorting();
```

Show `ArrowUp` / `ArrowDown` / `ArrowUpDown` icons; set `aria-sort` to `ascending` | `descending` | `none`. If `enableColumnOrdering`, render a drag handle with `provided.dragHandleProps` from parent (or accept `dragHandleProps` prop). Do not start a sort when interacting with the drag handle (`stopPropagation` on pointer down).

- [ ] **Step 2: Column visibility dropdown**

Use `DropdownMenu` + `Checkbox` for each `table.getAllLeafColumns().filter(c => c.getCanHide())`. Label from column header string or `column.id`.

- [ ] **Step 3: Pagination footer**

Show `Showing {from}–{to} of {total}`. Buttons: Previous, numbered/`ellipsis` via `getPaginationItems`, Next. Page size `Select` with `pageSizeOptions`. Convert `pageIndex` (0-based) ↔ display page (1-based). Disable Previous when `pageIndex === 0`; disable Next when on last page. Disable controls when `isLoading`/`disabled`.

- [ ] **Step 4: Export menu**

`DropdownMenu` with CSV / Excel items. Call `onExport(format)`. Local `exporting` flag or parent `isExporting` — disable menu while pending; show spinner on trigger. On failure, show inline `text-destructive` message under toolbar actions (no toast).

- [ ] **Step 5: Toolbar**

Layout:

```text
[ Search input flex-1 ]   [ Columns ] [ Refresh ] [ Export ]
```

- Debounce search 400ms with local input state synced from `search` prop.
- Refresh: `Button` icon `RefreshCw`, `aria-label="Refresh"`, spin when `isFetching`, disabled while fetching; call `onRefresh`.
- Wrap with `flex flex-wrap gap-2` for responsive behavior.

- [ ] **Step 6: Commit**

```bash
git add components/data-table/
git commit -m "feat: add DataTable toolbar, pagination, and column controls"
```

---

### Task 8: Main `DataTable` (TanStack v9 + DnD + resize)

**Files:**
- Create: `components/data-table/data-table.tsx`
- Create: `components/data-table/index.ts`

**Interfaces:**
- Consumes: all Task 5–7 pieces, `DataTableProps`
- Produces: `<DataTable />` export

- [ ] **Step 1: Implement DataTable**

Core wiring (v9):

```tsx
const prefs = useDataTablePreferences(tableId);

const table = useTable({
  features: dataTableFeatures,
  data,
  columns,
  getRowId,
  manualPagination: true,
  manualSorting: true,
  rowCount: totalCount,
  state: {
    pagination,
    sorting,
    columnVisibility: prefs.columnVisibility,
    columnOrder: prefs.columnOrder,
    columnSizing: prefs.columnSizing,
  },
  onPaginationChange,
  onSortingChange,
  onColumnVisibilityChange: prefs.setColumnVisibility,
  onColumnOrderChange: prefs.setColumnOrder,
  onColumnSizingChange: prefs.setColumnSizing,
  enableColumnResizing: enableColumnResizing ?? true,
  columnResizeMode: "onChange",
  defaultColumn: {
    minSize: 80,
    size: 160,
    maxSize: 480,
  },
});
```

Render order:

1. Toolbar
2. If `isError` && !data length → `DataTableError`
3. Else if `isLoading` → `DataTableSkeleton`
4. Else table body:
   - Wrap header row drag-and-drop with `@hello-pangea/dnd` `DragDropContext` / `Droppable` / `Draggable` **only if** `enableColumnOrdering`.
   - On drag end, reorder `columnOrder` (initialize order from leaf column ids if empty).
   - Use `table.getHeaderGroups()` / `flexRender` for headers and cells.
   - Apply column size styles: `style={{ width: header.getSize() }}` / cell size.
   - Resize handle on `TableHead` using `header.getResizeHandler()` when resizing enabled.
   - Soft fetch: `relative` wrapper + `opacity-60` overlay when `isFetching && !isLoading`.
   - If no rows → `DataTableEmpty`.
5. Pagination footer always (unless error with no data).

Accessibility: table has caption or `aria-label` from optional prop defaulting to `"Data table"`.

- [ ] **Step 2: Barrel export**

```ts
// components/data-table/index.ts
export { DataTable } from "./data-table";
export type { DataTableProps, DataTableExportFormat } from "./types";
```

- [ ] **Step 3: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors related to DataTable. Fix v9 type arity / feature option names against compiler output if needed.

- [ ] **Step 4: Commit**

```bash
git add components/data-table/
git commit -m "feat: implement reusable DataTable with sort, resize, and column DnD"
```

---

### Task 9: Users columns + page wiring

**Files:**
- Create: `components/backoffice/users/users-columns.tsx`
- Create: `components/backoffice/users/users-table.tsx`
- Modify: `app/(backoffice)/backoffice/users/page.tsx`

**Interfaces:**
- Consumes: `DataTable`, `useUsersQuery`, `useExportUsers`, `nuqs`, `downloadBlob`
- Produces: working `/backoffice/users` page

- [ ] **Step 1: Columns**

Use `createColumnHelper` bound to `DataTableFeatures` + `User` if types require it; otherwise plain `ColumnDef` array. Columns: `name` (hide disabled), `email`, `role`, `status`, `shop`, `createdAt` — all sortable except optionally status badge display. Format `createdAt` with `toLocaleDateString()`.

- [ ] **Step 2: UsersTable client component**

```tsx
"use client";

import { useMemo } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import type { SortingState, PaginationState, OnChangeFn } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { downloadBlob } from "@/components/data-table/utils/export-download";
import { useExportUsers, useUsersQuery } from "@/hooks/use-users";
import { usersColumns } from "./users-columns";

const searchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20),
  search: parseAsString.withDefault(""),
  sortBy: parseAsString,
  sortOrder: parseAsStringEnum(["asc", "desc"]),
};

export function UsersTable() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    history: "replace",
    shallow: true,
  });

  const listParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    sortBy: (params.sortBy as "name" | "email" | "role" | "status" | "shop" | "createdAt" | undefined) || undefined,
    sortOrder: params.sortOrder ?? undefined,
  };

  const query = useUsersQuery(listParams);
  const exportMutation = useExportUsers();

  const pagination: PaginationState = {
    pageIndex: Math.max(0, params.page - 1),
    pageSize: params.pageSize,
  };

  const sorting: SortingState = useMemo(() => {
    if (!params.sortBy || !params.sortOrder) return [];
    return [{ id: params.sortBy, desc: params.sortOrder === "desc" }];
  }, [params.sortBy, params.sortOrder]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    void setParams({
      page: next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    void setParams({
      sortBy: first?.id ?? null,
      sortOrder: first ? (first.desc ? "desc" : "asc") : null,
      page: 1,
    });
  };

  const onSearchChange = (value: string) => {
    void setParams({ search: value, page: 1 });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <DataTable
        tableId="backoffice-users"
        columns={usersColumns}
        data={query.data?.data ?? []}
        totalCount={query.data?.meta.total ?? 0}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        sorting={sorting}
        onSortingChange={onSortingChange}
        search={params.search}
        onSearchChange={onSearchChange}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        onRefresh={() => void query.refetch()}
        onExport={async (format) => {
          const blob = await exportMutation.mutateAsync({
            format,
            search: listParams.search,
            sortBy: listParams.sortBy,
            sortOrder: listParams.sortOrder,
          });
          downloadBlob(blob, format === "csv" ? "users.csv" : "users.xlsx");
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
```

Adjust `sortBy` typing to `keyof User` as needed. Ensure search debounce lives inside DataTable toolbar (URL updates only after debounce via `onSearchChange`).

- [ ] **Step 3: Page**

```tsx
// app/(backoffice)/backoffice/users/page.tsx
import { UsersTable } from "@/components/backoffice/users/users-table";

export default function UsersPage() {
  return <UsersTable />;
}
```

- [ ] **Step 4: Typecheck + smoke**

```bash
npx tsc --noEmit
```

Open `http://localhost:3000/backoffice/users` and verify skeleton → rows.

- [ ] **Step 5: Commit**

```bash
git add components/backoffice/users app/(backoffice)/backoffice/users/page.tsx
git commit -m "feat: wire Backoffice Users page to DataTable and mock API"
```

---

### Task 10: Manual verification pass

**Files:** none (QA only); fix bugs if found then commit fixes.

- [ ] **Step 1: Run checklist from spec**

1. `/backoffice/users` loads with skeleton then rows.
2. Page / pageSize change → network request; “Showing X–Y of Z”; Prev/Next bounds.
3. Sort cycles none → asc → desc → none; URL params update.
4. Search debounced; page resets to 1; empty copy + clear works.
5. Column hide/show, reorder, resize survive refresh (localStorage `datatable-preferences`).
6. Refresh refetches; spinner; no double-fire.
7. Export CSV + Excel download with current search/sort.
8. Simulate error (temporary throw in `fetchUsers`) → error UI + Try Again.
9. Narrow viewport → horizontal scroll; toolbar wraps.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A
git commit -m "fix: address DataTable QA findings"
```

(Skip empty commit if nothing to fix.)

---

## Self-review

**1. Spec coverage**
- Controlled DataTable + RQ + services + mock API → Tasks 3–4, 8–9
- URL state (`nuqs`) → Tasks 1, 9
- Zustand prefs → Task 5
- Server pagination/sort/search → Tasks 2–3, 8–9
- Column visibility/order/sizing + DnD + resize → Tasks 7–8
- Export CSV/XLSX via mock API → Tasks 3–4, 7, 9
- Toolbar / pagination / skeleton / empty / error / a11y → Tasks 6–8
- Users demo page → Task 9
- Manual QA → Task 10

**2. Placeholder scan:** No TBD/TODO left; v9 type arity note is an explicit “fix against compiler” instruction, not an open requirement.

**3. Type consistency:** `UsersListParams` / `UsersListResponse` / `tableId="backoffice-users"` / `dataTableFeatures` / `DataTableExportFormat` names align across tasks.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-14-data-table.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration  

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints  

Which approach?
