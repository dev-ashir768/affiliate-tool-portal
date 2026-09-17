import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import type { PlatformStaff } from "@/types/platform";
import { patchStaffSchema } from "@/validations/platform.validations";

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

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const parsed = patchStaffSchema.safeParse(body);
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
    const data = await authenticatedApiFetch<ApiStaff>(
      `/api/v1/platform/staff/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      }
    );
    return NextResponse.json({
      id: data.id,
      role: data.role,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.user.name,
      email: data.user.email,
      userId: data.user.id,
      userStatus: data.user.status,
    } satisfies PlatformStaff);
  } catch (err) {
    return platformErrorResponse(err, "Failed to update staff");
  }
}
