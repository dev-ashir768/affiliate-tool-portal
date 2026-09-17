import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import {
  platformErrorResponse,
  toQuery,
} from "@/lib/api/platform-bff";
import type { PlatformStaff, PlatformStaffListResponse } from "@/types/platform";
import { createStaffSchema } from "@/validations/platform.validations";

type ApiStaff = {
  id: string;
  role: PlatformStaff["role"];
  status: PlatformStaff["status"];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
  };
};

function flatten(row: ApiStaff): PlatformStaff {
  return {
    id: row.id,
    role: row.role,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    name: row.user.name,
    email: row.user.email,
    userId: row.user.id,
    userStatus: row.user.status,
  };
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const qs = toQuery({
      page: sp.get("page"),
      pageSize: sp.get("pageSize"),
      search: sp.get("search"),
      sortBy: sp.get("sortBy"),
      sortOrder: sp.get("sortOrder"),
    });
    const data = await authenticatedApiFetch<{
      data: ApiStaff[];
      meta: PlatformStaffListResponse["meta"];
    }>(`/api/v1/platform/staff${qs}`, { method: "GET" });
    return NextResponse.json({
      data: data.data.map(flatten),
      meta: data.meta,
    } satisfies PlatformStaffListResponse);
  } catch (err) {
    return platformErrorResponse(err, "Failed to load staff");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createStaffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }
    const data = await authenticatedApiFetch<ApiStaff>("/api/v1/platform/staff", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return NextResponse.json(flatten(data), { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to create staff");
  }
}
