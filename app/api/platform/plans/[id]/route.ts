import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { patchPlatformPlanSchema } from "@/validations/platform.validations";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = patchPlatformPlanSchema.parse(await req.json());
    const data = await authenticatedApiFetch(
      `/api/v1/platform/plans/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to update plan");
  }
}
