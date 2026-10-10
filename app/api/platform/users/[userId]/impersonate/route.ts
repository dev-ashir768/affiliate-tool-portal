import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { verifyAccessClaims } from "@/lib/auth/access-token";
import {
  setSessionCookies,
  stashStaffSessionForImpersonation,
} from "@/lib/auth/session";

type Props = { params: Promise<{ userId: string }> };

type ImpersonateResponse = {
  user: { id: string; email: string; name: string };
  organizationId: string;
  redirectTo: string;
  accessToken: string;
  refreshToken: string;
};

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { userId } = await params;
    const body = (await req.json()) as { organizationId?: string };
    if (!body.organizationId?.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "organizationId is required",
          },
        },
        { status: 400 },
      );
    }

    const data = await authenticatedApiFetch<ImpersonateResponse>(
      `/api/v1/platform/users/${encodeURIComponent(userId)}/impersonate`,
      {
        method: "POST",
        body: JSON.stringify({ organizationId: body.organizationId }),
      },
    );

    if (!data.accessToken?.trim() || !data.refreshToken?.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL",
            message:
              "Impersonation tokens missing. Check PORTAL_BFF_SECRET on portal and APIs.",
          },
        },
        { status: 502 },
      );
    }

    const claims = await verifyAccessClaims(data.accessToken);
    if (!claims) {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL",
            message:
              "Impersonation token could not be verified. JWT secrets must match.",
          },
        },
        { status: 502 },
      );
    }

    await stashStaffSessionForImpersonation({
      email: data.user.email,
      name: data.user.name,
    });
    await setSessionCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return NextResponse.json({
      redirectTo: data.redirectTo,
      user: data.user,
      organizationId: data.organizationId,
    });
  } catch (err) {
    return platformErrorResponse(err, "Failed to start impersonation");
  }
}
