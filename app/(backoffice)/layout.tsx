import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireStaffArea } from "@/lib/auth/require-area";

type Props = { children: ReactNode };

export default async function BackofficeLayout({ children }: Props) {
  await requireStaffArea();
  return <AppShell area="backoffice">{children}</AppShell>;
}
