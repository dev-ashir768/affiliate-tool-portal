"use client";

import { cn } from "cn";
import { SidebarNavItem } from "@/components/layout/nav-item";
import type { NavResponse } from "@/types/navigation";

export function AppSidebar({
  data,
  pathname,
  isLoading,
  isError,
  onNavigate,
  collapsed = false,
  className,
}: {
  data?: NavResponse;
  pathname: string;
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden rounded-tl-2xl border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
        className
      )}
    >
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-3",
          collapsed ? "flex flex-col items-center gap-1.5 px-2" : "px-2"
        )}
      >
        {isLoading ? (
          <div className={cn("space-y-2", collapsed ? "w-full" : "px-2")}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "animate-pulse rounded-lg bg-sidebar-accent",
                  collapsed ? "mx-auto size-9" : "h-9"
                )}
              />
            ))}
          </div>
        ) : null}

        {isError && !collapsed ? (
          <p className="px-2 text-sm text-sidebar-foreground">
            Couldn&apos;t load navigation
          </p>
        ) : null}

        {data?.sections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "mb-1",
              collapsed ? "flex flex-col items-center gap-1.5" : "flex flex-col gap-1.5"
            )}
          >
            {section.label && !collapsed ? (
              <p className="px-2.5 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-sidebar-foreground/70 uppercase">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                collapsed={collapsed}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
