import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";
import { requireMerchantArea } from "@/lib/auth/require-area";
import { getImpersonationMeta, isImpersonating } from "@/lib/auth/session";

type Props = { children: ReactNode };

export default async function DashboardLayout({ children }: Props) {
  await requireMerchantArea();
  const impersonating = await isImpersonating();
  const meta = impersonating ? await getImpersonationMeta() : null;
  return (
    <AppShell
      area="dashboard"
      topSlot={
        meta ? (
          <ImpersonationBanner email={meta.email} name={meta.name} />
        ) : null
      }
    >
      {children}
    </AppShell>
  );
}
