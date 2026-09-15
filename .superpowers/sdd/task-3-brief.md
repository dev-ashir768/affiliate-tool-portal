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

