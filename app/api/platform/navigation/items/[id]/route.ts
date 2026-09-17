import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { z } from "zod";

const patchSchema = z
  .object({
    label: z.string().min(1).max(120).optional(),
    href: z.string().min(1).max(200).optional(),
    icon: z.string().min(1).max(64).optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
    badge: z.string().max(32).optional().nullable(),
    enabled: z.boolean().optional(),
    allowedPlatformRoles: z
      .array(z.enum(["SUPERADMIN", "FINANCE", "OPS"]))
      .optional(),
    allowedOrgRoles: z.array(z.enum(["OWNER", "ADMIN", "MEMBER"])).optional(),
  })
  .refine((b) => Object.keys(b).length > 0, {
    message: "At least one field is required",
  });

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = patchSchema.parse(await req.json());
    const data = await authenticatedApiFetch(
      `/api/v1/platform/navigation/items/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    return platformErrorResponse(err, "Failed to update nav item");
  }
}
