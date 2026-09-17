import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { Shop } from "@/types/shops";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await authenticatedApiFetch<Shop>(
      `/api/v1/shops/${encodeURIComponent(id)}`,
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
      { error: { code: "INTERNAL", message: "Failed to load shop" } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await authenticatedApiFetch<Shop>(
      `/api/v1/shops/${encodeURIComponent(id)}`,
      { method: "DELETE" }
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
      { error: { code: "INTERNAL", message: "Failed to disconnect shop" } },
      { status: 500 }
    );
  }
}
