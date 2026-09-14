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
  className,
}: {
  data?: NavResponse;
  pathname: string;
  isLoading: boolean;
  isError: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col overflow-hidden rounded-tl-2xl bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {isLoading ? (
          <div className="space-y-2 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-md bg-sidebar-accent"
              />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="px-4 text-sm text-sidebar-foreground/60">
            Couldn&apos;t load navigation
          </p>
        ) : null}

        {data?.sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-1.5 mb-1">
            {section.label ? (
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
                {section.label}
              </p>
            ) : null}
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
