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
        "flex h-full w-60 shrink-0 flex-col border-r border-border bg-muted/30 overflow-hidden rounded-tl-3xl",
        className,
      )}
    >
      <nav className="flex-1 overflow-y-auto py-3">
        {isLoading ? (
          <div className="space-y-2 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="px-4 text-sm text-muted-foreground">
            Couldn&apos;t load navigation
          </p>
        ) : null}

        {data?.sections.map((section) => (
          <div key={section.id} className="mb-1">
            {section.label ? (
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
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
