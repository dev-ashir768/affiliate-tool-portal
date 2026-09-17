import { NextResponse } from "next/server";
import { apiFetch, ApiClientError } from "@/lib/auth/api";
import { getAccessToken } from "@/lib/auth/session";
import type { AcceptInviteResponse } from "@/types/orgs";
import { acceptInviteSchema } from "@/validations/org.validations";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    if (!token?.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invite token is required",
          },
        },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = acceptInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 },
      );
    }

    const accessToken = await getAccessToken();

    // Stub/new-user path: password + name required when no session cookie.
    if (!accessToken) {
      if (!parsed.data.password || !parsed.data.name) {
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "password and name are required for new users",
            },
          },
          { status: 400 },
        );
      }
    }

    const payload: { password?: string; name?: string } = {};
    if (parsed.data.password) payload.password = parsed.data.password;
    if (parsed.data.name) payload.name = parsed.data.name;

    const data = await apiFetch<
      Omit<AcceptInviteResponse, "redirectTo">
    >(`/api/v1/orgs/invites/${encodeURIComponent(token)}/accept`, {
      method: "POST",
      body: JSON.stringify(payload),
      ...(accessToken ? { accessToken } : {}),
    });

    // API does not issue tokens on accept — session cookie means already logged in.
    const redirectTo = accessToken ? "/home" : "/login";

    return NextResponse.json(
      { ...data, redirectTo } satisfies AcceptInviteResponse,
      { status: 200 },
    );
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
      { error: { code: "INTERNAL", message: "Failed to accept invite" } },
      { status: 500 },
    );
  }
}
