"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigation } from "@/hooks/use-navigation";
import type { NavArea } from "@/types/navigation";

export function AppShell({
  area,
  children,
}: {
  area: NavArea;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useNavigation(area);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const sections = data?.sections ?? [];

  function handleMenuClick() {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      setDesktopOpen((v) => !v);
      return;
    }
    setMobileOpen(true);
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <AppTopbar brand={data?.brand} onMenuClick={handleMenuClick} />

      <div className="flex min-h-0 flex-1">
        {desktopOpen ? (
          <div className="hidden lg:block">
            <AppSidebar
              data={data}
              pathname={pathname}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        ) : null}

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-60 p-0"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar
              data={data}
              pathname={pathname}
              isLoading={isLoading}
              isError={isError}
              onNavigate={() => setMobileOpen(false)}
              className="border-0"
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppPageHeader sections={sections} pathname={pathname} />
          <main className="flex-1 overflow-y-auto px-4 pb-6 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
