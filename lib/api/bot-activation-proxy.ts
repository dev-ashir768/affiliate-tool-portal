import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";

/** Forward one bot-activation call to the API, mapping its errors through. */
export async function proxyActivation(
  shopId: string,
  suffix: string,
  init: RequestInit,
  fallbackMessage: string,
) {
  try {
    const data = await authenticatedApiFetch<unknown>(
      `/api/v1/shops/${encodeURIComponent(shopId)}/bot-activation${suffix}`,
      init,
    );
    if (data === undefined) {
      return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json(
        { error: { code: err.code, message: err.message } },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL", message: fallbackMessage } },
      { status: 500 },
    );
  }
}
