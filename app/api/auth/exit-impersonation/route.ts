import { NextResponse } from "next/server";
import {
  clearBreakGlassSession,
  getImpersonationMeta,
  restoreStaffSessionFromImpersonation,
} from "@/lib/auth/session";

export async function POST() {
  const meta = await getImpersonationMeta();
  if (meta?.mode === "break_glass") {
    await clearBreakGlassSession();
    return NextResponse.json({ redirectTo: "/login" });
  }

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
