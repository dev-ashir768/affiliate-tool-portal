"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { NavIcon } from "@/components/layout/nav-icon";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types/navigation";

export function SidebarNavItem({
  item,
  pathname,
  onNavigate,
  depth = 0,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  depth?: number;
}) {
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((child) =>
    isNavItemActive(pathname, child.href)
  );
  const active = isNavItemActive(pathname, item.href) && !hasChildren;
  const [open, setOpen] = useState(Boolean(childActive));

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-3 border-l-[3px] border-transparent px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
            (open || childActive) && "text-foreground"
          )}
          style={depth ? { paddingLeft: `${16 + depth * 12}px` } : undefined}
        >
          <NavIcon name={item.icon} className="size-4 shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 transition-transform",
              open && "rotate-90"
            )}
          />
        </button>
        {open ? (
          <div>
            {item.children!.map((child) => (
              <SidebarNavItem
                key={child.id}
                item={child}
                pathname={pathname}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-3 border-l-[3px] border-transparent px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
        active &&
          "border-l-primary bg-secondary font-medium text-secondary-foreground shadow-sm"
      )}
      style={depth ? { paddingLeft: `${16 + depth * 12}px` } : undefined}
    >
      <NavIcon name={item.icon} className="size-4 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
          {item.badge}
        </Badge>
      ) : null}
    </Link>
  );
}
