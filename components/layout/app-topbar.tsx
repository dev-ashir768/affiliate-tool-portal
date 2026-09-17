"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useMe } from "@/hooks/use-me";
import type { NavBrand } from "@/types/navigation";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

export function AppTopbar({
  brand,
  onMenuClick,
  showCloseIcon,
}: {
  brand?: NavBrand;
  onMenuClick: () => void;
  showCloseIcon: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const displayName = me?.user.name ?? "Account";
  const subtitle = me?.user.email ?? "…";
  const initials = initialsFromName(displayName);
  const isStaff = Boolean(me?.platformMembership);
  const settingsHref = isStaff ? "/backoffice/users" : "/settings";

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 bg-topbar px-2 text-topbar-foreground">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label={
            showCloseIcon ? "Expand navigation" : "Collapse navigation"
          }
          aria-expanded={!showCloseIcon}
          className="text-topbar-foreground hover:bg-topbar-accent hover:text-topbar-accent-foreground"
        >
          {showCloseIcon ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </Button>

        <Link href={brand?.href ?? "#"} className="shrink-0">
          <Image
            src="/images/brandings/logo.png"
            alt={brand?.name ?? "Tiksly"}
            width={100}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-topbar-foreground outline-none hover:bg-topbar-accent focus-visible:ring-2 focus-visible:ring-topbar-foreground/30"
            aria-label="User menu"
          >
            <Avatar className="size-8 rounded-full">
              <AvatarFallback className="rounded-full bg-topbar-accent text-xs text-topbar-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold text-topbar-foreground">
                {displayName}
              </p>
              <p className="text-xs text-topbar-foreground/70">{subtitle}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(settingsHref)}
            >
              {isStaff ? "Staff console" : "Settings"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                void handleLogout();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
