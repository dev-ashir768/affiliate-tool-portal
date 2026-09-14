"use client";

import { findActiveNavItem } from "@/lib/navigation";
import type { NavSection } from "@/types/navigation";

export function AppPageHeader({
  sections,
  pathname,
}: {
  sections: NavSection[];
  pathname: string;
}) {
  const active = findActiveNavItem(sections, pathname);
  const title =
    active?.label ??
    pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ??
    "Home";

  return (
    <div className="px-4 pt-4 pb-2">
      <h1 className="text-2xl font-bold tracking-tight capitalize text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back, Tiksly Admin
      </p>
    </div>
  );
}
