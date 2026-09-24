import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import {
  platformErrorResponse,
  toQuery,
} from "@/lib/api/platform-bff";
import type { OrgAuditLogEntry } from "@/types/orgs";

type UpstreamResponse = {
  items: OrgAuditLogEntry[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const qs = toQuery({
      page: sp.get("page"),
      pageSize: sp.get("pageSize"),
      from: sp.get("from"),
      to: sp.get("to"),
      search: sp.get("search"),
    });
    const upstream = await authenticatedApiFetch<UpstreamResponse>(
      `/api/v1/orgs/current/audit${qs}`,
      { method: "GET" },
    );
    return NextResponse.json({
      data: upstream.items ?? [],
      meta: upstream.meta,
    });
  } catch (err) {
    return platformErrorResponse(err, "Failed to load activity");
  }
}
