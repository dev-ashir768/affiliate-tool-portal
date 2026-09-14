"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { NavIcon } from "@/components/layout/nav-icon";
import { isNavItemActive } from "@/lib/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavItem } from "@/types/navigation";

function firstHref(item: NavItem): string {
  if (item.children?.length) return firstHref(item.children[0]!);
  return item.href === "#" ? "/" : item.href;
}

export function SidebarNavItem({
  item,
  pathname,
  onNavigate,
  depth = 0,
  collapsed = false,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  depth?: number;
  collapsed?: boolean;
}) {
  const hasChildren = Boolean(item.children?.length);
  const childActive = item.children?.some((child) =>
    isNavItemActive(pathname, child.href)
  );
  const active = isNavItemActive(pathname, item.href) && !hasChildren;
  const [open, setOpen] = useState(Boolean(childActive));

  if (collapsed) {
    const href = firstHref(item);
    const isActive =
      active ||
      Boolean(childActive) ||
      isNavItemActive(pathname, href);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            delay={200}
            render={
              <Link
                href={href}
                onClick={onNavigate}
                aria-label={item.label}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                )}
              />
            }
          >
            <NavIcon name={item.icon} className="size-4 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            (open || childActive) && "text-sidebar-accent-foreground"
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
        "relative flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active &&
          "bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
      )}
      style={depth ? { paddingLeft: `${16 + depth * 12}px` } : undefined}
    >
      <NavIcon name={item.icon} className="size-4 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <Badge
          variant="secondary"
          className={cn(
            "h-5 px-1.5 text-xs",
            active &&
              "border-transparent bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
          )}
        >
          {item.badge}
        </Badge>
      ) : null}
    </Link>
  );
}
