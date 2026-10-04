import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { revokePlatformAccessSchema } from "@/validations/platform.validations";

type Props = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = revokePlatformAccessSchema.parse(await req.json());
    const data = await authenticatedApiFetch(
      `/api/v1/platform/organizations/${encodeURIComponent(id)}/revoke-access`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to revoke organization access");
  }
}
