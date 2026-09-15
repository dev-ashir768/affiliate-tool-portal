### Task 9: Users columns + page wiring

**Files:**
- Create: `components/backoffice/users/users-columns.tsx`
- Create: `components/backoffice/users/users-table.tsx`
- Modify: `app/(backoffice)/backoffice/users/page.tsx`

**Interfaces:**
- Consumes: `DataTable`, `useUsersQuery`, `useExportUsers`, `nuqs`, `downloadBlob`
- Produces: working `/backoffice/users` page

- [ ] **Step 1: Columns**

Use `createColumnHelper` bound to `DataTableFeatures` + `User` if types require it; otherwise plain `ColumnDef` array. Columns: `name` (hide disabled), `email`, `role`, `status`, `shop`, `createdAt` â€” all sortable except optionally status badge display. Format `createdAt` with `toLocaleDateString()`.

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

Open `http://localhost:3000/backoffice/users` and verify skeleton â†’ rows.

- [ ] **Step 5: Commit**

```bash
git add components/backoffice/users app/(backoffice)/backoffice/users/page.tsx
git commit -m "feat: wire Backoffice Users page to DataTable and mock API"
```

---

