import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

type Props = { children: ReactNode };

export default function BackofficeLayout({ children }: Props) {
  return <AppShell area="backoffice">{children}</AppShell>;
}
