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

  const rows = sortUsers(
    filterUsers(MOCK_USERS, search || undefined),
    sortBy || undefined,
    sortOrder || undefined,
  );

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
