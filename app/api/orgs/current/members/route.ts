import { NextRequest, NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type {
  MembersListParams,
  MembersListResponse,
  OrgMember,
} from "@/types/orgs";

export const runtime = "nodejs";

type UpstreamMember = {
  id: string;
  role: OrgMember["role"];
  status: OrgMember["status"];
  user: { id: string; email: string; name: string };
};

const SEARCH_FIELDS: (keyof OrgMember)[] = ["name", "email", "role", "status"];
const SORT_FIELDS = new Set(["name", "email", "role", "status"]);

function mapMember(m: UpstreamMember): OrgMember {
  return {
    id: m.id,
    role: m.role,
    status: m.status,
    name: m.user.name,
    email: m.user.email,
    userId: m.user.id,
  };
}

function filterMembers(members: OrgMember[], search?: string): OrgMember[] {
  const q = search?.trim().toLowerCase();
  if (!q) return members;
  return members.filter((m) =>
    SEARCH_FIELDS.some((field) => String(m[field]).toLowerCase().includes(q)),
  );
}

function sortMembers(
  members: OrgMember[],
  sortBy?: MembersListParams["sortBy"],
  sortOrder?: MembersListParams["sortOrder"],
): OrgMember[] {
  if (!sortBy || !sortOrder) return members;
  const dir = sortOrder === "asc" ? 1 : -1;
  return [...members].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

function filterSortPaginateMembers(
  members: OrgMember[],
  params: MembersListParams,
): MembersListResponse {
  const filtered = filterMembers(members, params.search);
  const sorted = sortMembers(filtered, params.sortBy, params.sortOrder);
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const start = (page - 1) * pageSize;
  return {
    data: sorted.slice(start, start + pageSize),
    meta: { total: sorted.length, page, pageSize },
  };
}

function parseParams(url: URL): MembersListParams {
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const search = url.searchParams.get("search") ?? undefined;
  const sortByRaw = url.searchParams.get("sortBy");
  const sortOrderRaw = url.searchParams.get("sortOrder");
  const sortBy =
    sortByRaw && SORT_FIELDS.has(sortByRaw)
      ? (sortByRaw as MembersListParams["sortBy"])
      : undefined;
  const sortOrder =
    sortOrderRaw === "asc" || sortOrderRaw === "desc"
      ? sortOrderRaw
      : undefined;
  return {
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    search: search || undefined,
    sortBy,
    sortOrder,
  };
}

export async function GET(req: NextRequest) {
  try {
    const upstream = await authenticatedApiFetch<{ members: UpstreamMember[] }>(
      "/api/v1/orgs/current/members",
      { method: "GET" },
    );
    const members = (upstream.members ?? []).map(mapMember);
    const result = filterSortPaginateMembers(members, parseParams(req.nextUrl));
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load members" } },
      { status: 500 },
    );
  }
}
