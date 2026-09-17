import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import type { CheckoutSessionResponse } from "@/types/billing";
import { checkoutSessionSchema } from "@/validations/billing.validations";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = checkoutSessionSchema.safeParse(body);
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

    const data = await authenticatedApiFetch<CheckoutSessionResponse>(
      "/api/v1/billing/checkout-session",
      {
        method: "POST",
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
      { error: { code: "INTERNAL", message: "Failed to create checkout session" } },
      { status: 500 }
    );
  }
}
