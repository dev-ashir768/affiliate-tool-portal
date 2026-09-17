import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { OrganizationCurrent } from "@/types/orgs";
import { patchCurrentOrgSchema } from "@/validations/org.validations";

export async function GET() {
  try {
    const data = await authenticatedApiFetch<OrganizationCurrent>(
      "/api/v1/orgs/current",
      { method: "GET" }
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load organization" } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = patchCurrentOrgSchema.safeParse(body);
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

    const data = await authenticatedApiFetch<OrganizationCurrent>(
      "/api/v1/orgs/current",
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        {
          error: { code: err.code, message: err.message, details: err.details },
        },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to update organization" } },
      { status: 500 }
    );
  }
}
