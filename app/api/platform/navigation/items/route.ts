import { NextRequest, NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";
import { z } from "zod";

const createSchema = z.object({
  sectionId: z.string().min(1),
  key: z.string().min(1).max(64),
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(200),
  icon: z.string().min(1).max(64),
  sortOrder: z.coerce.number().int().min(0).default(0),
  badge: z.string().max(32).optional().nullable(),
  enabled: z.boolean().optional(),
  allowedPlatformRoles: z
    .array(z.enum(["SUPERADMIN", "FINANCE", "OPS"]))
    .optional(),
  allowedOrgRoles: z.array(z.enum(["OWNER", "ADMIN", "MEMBER"])).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    const data = await authenticatedApiFetch("/api/v1/platform/navigation/items", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to create nav item");
  }
}
