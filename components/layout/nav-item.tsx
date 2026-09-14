"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function IconRailLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          delay={200}
          render={
            <Link
              href={href}
              onClick={onNavigate}
              aria-label={label}
              className={cn(
                "flex h-9 w-full items-center rounded-lg px-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active &&
                  "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              )}
            />
          }
        >
          <NavIcon name={icon} className="size-4 shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function IconRailFlyout({
  item,
  pathname,
  onNavigate,
  active,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    clearCloseTimer();
    setOpen(true);
  }

  function hide() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.right + 6 });
  }, [open]);

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={item.label}
        aria-expanded={open}
        aria-haspopup="menu"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={cn(
          "flex h-9 w-full items-center rounded-lg px-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          active &&
            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
        )}
      >
        <NavIcon name={item.icon} className="size-4 shrink-0" />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="menu"
              onMouseEnter={show}
              onMouseLeave={hide}
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-50 min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <p className="px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
                {item.label}
              </p>
              {item.children!.map((child) => {
                const childActive = isNavItemActive(pathname, child.href);
                return (
                  <Link
                    key={child.id}
                    role="menuitem"
                    href={child.href}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      childActive && "bg-accent font-medium text-accent-foreground"
                    )}
                  >
                    <NavIcon name={child.icon} className="size-4 shrink-0" />
                    <span className="flex-1 truncate">{child.label}</span>
                    {child.badge ? (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {child.badge}
                      </Badge>
                    ) : null}
                  </Link>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </>
  );
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
    if (hasChildren) {
      return (
        <IconRailFlyout
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
          active={Boolean(childActive)}
        />
      );
    }

    return (
      <IconRailLink
        href={item.href}
        label={item.label}
        icon={item.icon}
        active={active}
        onNavigate={onNavigate}
      />
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
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
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
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <Badge
          variant="secondary"
          className={cn(
            "h-5 shrink-0 px-1.5 text-xs",
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
