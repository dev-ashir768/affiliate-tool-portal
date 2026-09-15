"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useNavigation } from "@/hooks/use-navigation";
import type { NavArea } from "@/types/navigation";

const LG_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mql = window.matchMedia(LG_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(LG_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

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
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );
  const sections = data?.sections ?? [];
  // Expanded → hamburger; collapsed / mobile sheet open → X
  const showCloseIcon = isDesktop ? !desktopExpanded : mobileOpen;

  function handleMenuClick() {
    if (window.matchMedia(LG_QUERY).matches) {
      setDesktopExpanded((v) => !v);
      return;
    }
    setMobileOpen((v) => !v);
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-topbar">
      <AppTopbar
        brand={data?.brand}
        onMenuClick={handleMenuClick}
        showCloseIcon={showCloseIcon}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden lg:block">
          <AppSidebar
            data={data}
            pathname={pathname}
            isLoading={isLoading}
            isError={isError}
            collapsed={!desktopExpanded}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-60 border-sidebar-border bg-sidebar p-0"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar
              data={data}
              pathname={pathname}
              isLoading={isLoading}
              isError={isError}
              onNavigate={() => setMobileOpen(false)}
              className="rounded-none border-0"
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-tr-2xl bg-muted">
          <AppPageHeader sections={sections} pathname={pathname} />
          <div className="min-w-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
