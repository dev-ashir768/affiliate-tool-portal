import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

const bodySchema = z.object({
  region: z.enum(["US", "UK"]).default("US"),
  shopId: z.string().min(1).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(raw);
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

    const data = await authenticatedApiFetch<{
      shopId: string;
      authorizeUrl: string;
      state: string;
    }>("/api/v1/shops/tiktok/oauth/start", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return NextResponse.json(data);
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
      { error: { code: "INTERNAL", message: "Failed to start TikTok OAuth" } },
      { status: 500 },
    );
  }
}
