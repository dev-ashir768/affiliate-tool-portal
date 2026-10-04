import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireMerchantArea } from "@/lib/auth/require-area";

type Props = { children: ReactNode };

export default async function DashboardLayout({ children }: Props) {
  await requireMerchantArea();
  return <AppShell area="dashboard">{children}</AppShell>;
}
