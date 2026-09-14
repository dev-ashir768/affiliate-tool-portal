"use client";

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
import type { NavBrand } from "@/types/navigation";

export function AppTopbar({
  brand,
  onMenuClick,
}: {
  brand?: NavBrand;
  onMenuClick: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 bg-primary text-primary-foreground sm:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Toggle navigation"
        className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
      >
        <MenuIcon className="size-5" />
      </Button>

      <Link
        href={brand?.href ?? "#"}
        className="shrink-0 text-lg font-bold tracking-wide uppercase"
      >
        {brand?.name ?? "Tiksly"}
      </Link>

      <div className="mx-auto hidden w-full max-w-xl flex-1 md:block">
        <label className="relative flex items-center">
          <SearchIcon className="pointer-events-none absolute left-3 size-4 text-primary-foreground/80" />
          <input
            type="search"
            placeholder="Search menus..."
            readOnly
            aria-label="Search menus"
            className="h-9 w-full rounded-lg border-0 bg-primary-foreground/15 pr-16 pl-9 text-sm text-primary-foreground placeholder:text-primary-foreground/70 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40"
          />
          <kbd className="pointer-events-none absolute right-2.5 rounded border border-primary-foreground/25 bg-primary-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground/80">
            Ctrl + K
          </kbd>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <BellIcon className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 outline-none hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground/40"
            aria-label="User menu"
          >
            <Avatar className="size-8 rounded-md">
              <AvatarFallback className="rounded-md bg-primary-foreground/20 text-xs text-primary-foreground">
                TK
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold">Tiksly Admin</p>
              <p className="text-xs text-primary-foreground/75">Super Admin</p>
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
