"use client";

import Image from "next/image";
import Link from "next/link";
import { BellIcon, MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { NavBrand } from "@/types/navigation";

export function AppTopbar({
  brand,
  onMenuClick,
}: {
  brand?: NavBrand;
  onMenuClick: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 bg-topbar px-2 text-topbar-foreground">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="text-topbar-foreground hover:bg-topbar-accent hover:text-topbar-accent-foreground"
        >
          <MenuIcon className="size-5" />
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

      <div className="hidden w-full max-w-xl flex-1 md:block">
        <label className="relative flex items-center">
          <SearchIcon className="pointer-events-none absolute left-3 size-4 text-topbar-foreground/70" />
          <input
            type="search"
            placeholder="Search menus..."
            readOnly
            aria-label="Search menus"
            className="h-9 w-full rounded-lg border-0 bg-topbar-accent pr-16 pl-9 text-sm text-topbar-accent-foreground placeholder:text-topbar-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-topbar-foreground/30"
          />
          <kbd className="pointer-events-none absolute right-2.5 rounded border border-topbar-border bg-topbar-accent px-1.5 py-0.5 text-[10px] font-medium text-topbar-foreground/70">
            Ctrl + K
          </kbd>
        </label>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-topbar-foreground hover:bg-topbar-accent hover:text-topbar-accent-foreground"
        >
          <BellIcon className="size-5" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-topbar-foreground outline-none hover:bg-topbar-accent focus-visible:ring-2 focus-visible:ring-topbar-foreground/30"
            aria-label="User menu"
          >
            <Avatar className="size-8 rounded-full">
              <AvatarFallback className="rounded-full bg-topbar-accent text-xs text-topbar-accent-foreground">
                TK
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold text-topbar-foreground">
                Tiksly Admin
              </p>
              <p className="text-xs text-topbar-foreground/70">Super Admin</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
