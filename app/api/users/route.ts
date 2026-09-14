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
