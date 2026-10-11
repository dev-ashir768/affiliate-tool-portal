import { NextResponse } from "next/server";
import { authenticatedApiFetch } from "@/lib/api/authenticated-fetch";
import { platformErrorResponse } from "@/lib/api/platform-bff";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await authenticatedApiFetch<void>(
      `/api/v1/auth/2fa/trusted-devices/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return platformErrorResponse(err, "Failed to revoke trusted device");
  }
}
