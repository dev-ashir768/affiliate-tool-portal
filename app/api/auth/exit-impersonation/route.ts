import { NextResponse } from "next/server";
import { restoreStaffSessionFromImpersonation } from "@/lib/auth/session";

export async function POST() {
  const restored = await restoreStaffSessionFromImpersonation();
  if (!restored) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "No staff session to restore",
        },
      },
      { status: 401 },
    );
  }
  return NextResponse.json({ redirectTo: "/backoffice/organizations" });
}
