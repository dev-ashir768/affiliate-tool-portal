import { NextResponse } from "next/server";
import { ApiClientError } from "@/lib/auth/api";

export function platformErrorResponse(err: unknown, fallback: string) {
  if (err instanceof ApiClientError) {
    return NextResponse.json(
      {
        error: { code: err.code, message: err.message, details: err.details },
      },
      { status: err.status }
    );
  }
  return NextResponse.json(
    { error: { code: "INTERNAL", message: fallback } },
    { status: 500 }
  );
}

export function toQuery(params: Record<string, string | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}
