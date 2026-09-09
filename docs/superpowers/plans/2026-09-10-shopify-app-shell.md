# Shopify-style App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a shared Shopify-like app chrome (sidebar + top bar + page header) for dashboard and backoffice, with navigation loaded from dummy JSON via client fetch + React Query.

**Architecture:** One client `AppShell` takes `area: "dashboard" | "backoffice"`, fetches `/data/navigation/{area}.json`, and renders desktop sidebar + mobile Sheet + top bar + page header around `{children}`. Both route-group layouts wrap children in that shell. Pure helpers (`isNavItemActive`, `findActiveNavItem`) drive active state and header copy.

**Tech Stack:** Next.js App Router 16, React 19, TanStack Query, shadcn (`Button`, `Sheet`, `Avatar`, `DropdownMenu`, `Input`, `Badge`), lucide-react, existing `sidebar-*` CSS tokens.

**Spec:** `docs/superpowers/specs/2026-09-10-shopify-app-shell-design.md`

## Global Constraints

- shadcn-first: compose from `components/ui/*`; no raw HTML form controls or parallel design systems.
- Colors: only CSS variables / Tailwind token classes from `globals.css` (no hard-coded hex in components).
- Nav data must be fetched (Network-visible); do not hardcode item lists inside sidebar components.
- Desktop sidebar always expanded (`w-60`); mobile uses Sheet; no collapsible icon-rail in v1.
- No new dependencies unless unavoidable (no Jest/Vitest for this — use a tiny `tsx` assert script for pure helpers).
- Follow ponytail: fewest files that still match the approved spec file list; no store switcher, real auth, or working search.

---

## File structure

| Path | Responsibility |
|------|----------------|
| `public/data/navigation/dashboard.json` | Dummy dashboard nav |
| `public/data/navigation/backoffice.json` | Dummy backoffice nav |
| `types/navigation.ts` | `NavBrand`, `NavItem`, `NavSection`, `NavResponse`, `NavArea` |
| `lib/navigation.ts` | Pure helpers: active match, find active item, area label |
| `lib/navigation.selfcheck.ts` | Runnable assert check for helpers |
| `components/layout/nav-icon.tsx` | Lucide name string → icon component |
| `hooks/use-navigation.ts` | React Query fetch for nav JSON |
| `components/layout/nav-item.tsx` | Single nav link row |
| `components/layout/app-sidebar.tsx` | Brand + sections (desktop or sheet body) |
| `components/layout/app-topbar.tsx` | Menu button, search placeholder, avatar menu |
| `components/layout/app-page-header.tsx` | Title + breadcrumb |
| `components/layout/app-shell.tsx` | Chrome orchestration + mobile sheet state |
| `app/(dashboard)/layout.tsx` | Wrap with `AppShell area="dashboard"` |
| `app/(backoffice)/layout.tsx` | Wrap with `AppShell area="backoffice"` |
| `app/(dashboard)/home/page.tsx` (and siblings) | Stub pages so nav is clickable |

---

### Task 1: Types, JSON fixtures, and active-nav helpers

**Files:**
- Create: `types/navigation.ts`
- Create: `public/data/navigation/dashboard.json`
- Create: `public/data/navigation/backoffice.json`
- Create: `lib/navigation.ts`
- Create: `lib/navigation.selfcheck.ts`
- Test: `lib/navigation.selfcheck.ts` (run with `npx tsx`)

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export type NavArea = "dashboard" | "backoffice"`
  - `export type NavBrand = { name: string; href: string }`
  - `export type NavItem = { id: string; label: string; href: string; icon: string; badge?: string; children?: NavItem[] }`
  - `export type NavSection = { id: string; label: string | null; items: NavItem[] }`
  - `export type NavResponse = { area: NavArea; brand: NavBrand; sections: NavSection[] }`
  - `isNavItemActive(pathname: string, href: string): boolean`
  - `findActiveNavItem(sections: NavSection[], pathname: string): NavItem | null`
  - `areaLabel(area: NavArea): string` → `"Dashboard"` | `"Backoffice"`

- [ ] **Step 1: Write types**

```ts
// types/navigation.ts
export type NavArea = "dashboard" | "backoffice";

export type NavBrand = {
  name: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavItem[];
};

export type NavSection = {
  id: string;
  label: string | null;
  items: NavItem[];
};

export type NavResponse = {
  area: NavArea;
  brand: NavBrand;
  sections: NavSection[];
};
```

- [ ] **Step 2: Write failing self-check for helpers**

```ts
// lib/navigation.selfcheck.ts
import assert from "node:assert/strict";
import { isNavItemActive, findActiveNavItem, areaLabel } from "./navigation";
import type { NavSection } from "@/types/navigation";

assert.equal(isNavItemActive("/orders", "/orders"), true);
assert.equal(isNavItemActive("/orders/123", "/orders"), true);
assert.equal(isNavItemActive("/products", "/orders"), false);
assert.equal(isNavItemActive("/", "/"), true);
assert.equal(isNavItemActive("/home", "/"), false);

const sections: NavSection[] = [
  {
    id: "main",
    label: null,
    items: [
      { id: "home", label: "Home", href: "/home", icon: "Home" },
      { id: "orders", label: "Orders", href: "/orders", icon: "ShoppingCart" },
    ],
  },
];

assert.equal(findActiveNavItem(sections, "/orders/9")?.id, "orders");
assert.equal(findActiveNavItem(sections, "/nope"), null);
assert.equal(areaLabel("dashboard"), "Dashboard");
assert.equal(areaLabel("backoffice"), "Backoffice");

console.log("navigation.selfcheck: ok");
```

- [ ] **Step 3: Run self-check — expect FAIL (module missing)**

Run: `npx tsx lib/navigation.selfcheck.ts`  
Expected: error resolving `./navigation` or exports

- [ ] **Step 4: Implement helpers**

```ts
// lib/navigation.ts
import type { NavArea, NavItem, NavSection } from "@/types/navigation";

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findActiveNavItem(
  sections: NavSection[],
  pathname: string
): NavItem | null {
  const items = sections.flatMap((s) => s.items);
  // Prefer longest matching href so /orders wins over /
  const matches = items.filter((item) => isNavItemActive(pathname, item.href));
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.href.length - a.href.length)[0] ?? null;
}

export function areaLabel(area: NavArea): string {
  return area === "dashboard" ? "Dashboard" : "Backoffice";
}
```

- [ ] **Step 5: Add JSON fixtures**

`public/data/navigation/dashboard.json`:

```json
{
  "area": "dashboard",
  "brand": { "name": "Tiksly", "href": "/home" },
  "sections": [
    {
      "id": "main",
      "label": null,
      "items": [
        { "id": "home", "label": "Home", "href": "/home", "icon": "Home" },
        { "id": "products", "label": "Products", "href": "/products", "icon": "Package" },
        { "id": "orders", "label": "Orders", "href": "/orders", "icon": "ShoppingCart", "badge": "12" }
      ]
    },
    {
      "id": "analytics",
      "label": "Analytics",
      "items": [
        { "id": "analytics", "label": "Analytics", "href": "/analytics", "icon": "BarChart3" }
      ]
    },
    {
      "id": "settings",
      "label": "Settings",
      "items": [
        { "id": "settings", "label": "Settings", "href": "/settings", "icon": "Settings" }
      ]
    }
  ]
}
```

`public/data/navigation/backoffice.json`:

```json
{
  "area": "backoffice",
  "brand": { "name": "Tiksly Backoffice", "href": "/backoffice/users" },
  "sections": [
    {
      "id": "main",
      "label": null,
      "items": [
        { "id": "users", "label": "Users", "href": "/backoffice/users", "icon": "Users" },
        { "id": "shops", "label": "Shops", "href": "/backoffice/shops", "icon": "Store" },
        { "id": "proxies", "label": "Proxies", "href": "/backoffice/proxies", "icon": "Globe" },
        { "id": "crawler", "label": "Crawler", "href": "/backoffice/crawler", "icon": "Bot" }
      ]
    }
  ]
}
```

- [ ] **Step 6: Re-run self-check — expect PASS**

Run: `npx tsx lib/navigation.selfcheck.ts`  
Expected: `navigation.selfcheck: ok`

- [ ] **Step 7: Commit**

```bash
git add types/navigation.ts public/data/navigation lib/navigation.ts lib/navigation.selfcheck.ts
git commit -m "feat: add nav types, dummy JSON, and active-route helpers"
```

---

### Task 2: Icon map + `useNavigation` hook

**Files:**
- Create: `components/layout/nav-icon.tsx`
- Create: `hooks/use-navigation.ts`

**Interfaces:**
- Consumes: `NavArea`, `NavResponse` from `types/navigation.ts`
- Produces:
  - `NavIcon({ name, className }: { name: string; className?: string }): JSX.Element`
  - `useNavigation(area: NavArea)` → React Query result typed as `NavResponse`

- [ ] **Step 1: Implement `NavIcon`**

```tsx
// components/layout/nav-icon.tsx
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Circle,
  Globe,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  Store,
  Globe,
  Bot,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Circle;
  return <Icon className={className} aria-hidden />;
}
```

- [ ] **Step 2: Implement `useNavigation`**

```ts
// hooks/use-navigation.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import type { NavArea, NavResponse } from "@/types/navigation";

async function fetchNavigation(area: NavArea): Promise<NavResponse> {
  const res = await fetch(`/data/navigation/${area}.json`);
  if (!res.ok) throw new Error("Couldn't load navigation");
  return res.json() as Promise<NavResponse>;
}

export function useNavigation(area: NavArea) {
  return useQuery({
    queryKey: ["navigation", area],
    queryFn: () => fetchNavigation(area),
  });
}
```

- [ ] **Step 3: Manual smoke — start/use existing `npm run dev`, open**

`http://localhost:3000/data/navigation/dashboard.json`  
Expected: JSON body with `"area": "dashboard"`

- [ ] **Step 4: Commit**

```bash
git add components/layout/nav-icon.tsx hooks/use-navigation.ts
git commit -m "feat: add nav icon map and useNavigation hook"
```

---

### Task 3: Nav item + sidebar

**Files:**
- Create: `components/layout/nav-item.tsx`
- Create: `components/layout/app-sidebar.tsx`

**Interfaces:**
- Consumes: `NavResponse`, `NavItem`, `isNavItemActive`, `NavIcon`, `Badge`, `Link` from `next/link`
- Produces:
  - `SidebarNavItem({ item, pathname, onNavigate? })`
  - `AppSidebar({ data, pathname, isLoading, isError, onNavigate?, className? })`

- [ ] **Step 1: Implement `SidebarNavItem`**

```tsx
// components/layout/nav-item.tsx
"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { NavIcon } from "@/components/layout/nav-icon";
import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types/navigation";

export function SidebarNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isNavItemActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
        active && "bg-sidebar-accent font-medium"
      )}
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
```

- [ ] **Step 2: Implement `AppSidebar`**

```tsx
// components/layout/app-sidebar.tsx
"use client";

import Link from "next/link";
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
        "flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          href={data?.brand.href ?? "#"}
          onClick={onNavigate}
          className="truncate text-sm font-semibold text-sidebar-foreground"
        >
          {data?.brand.name ?? "Loading…"}
        </Link>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-sidebar-accent"
              />
            ))}
          </div>
        ) : null}

        {isError ? (
          <p className="px-2 text-sm text-muted-foreground">
            Couldn&apos;t load navigation
          </p>
        ) : null}

        {data?.sections.map((section) => (
          <div key={section.id} className="space-y-1">
            {section.label ? (
              <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
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
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/nav-item.tsx components/layout/app-sidebar.tsx
git commit -m "feat: add sidebar nav item and AppSidebar"
```

---

### Task 4: Top bar + page header

**Files:**
- Create: `components/layout/app-topbar.tsx`
- Create: `components/layout/app-page-header.tsx`

**Interfaces:**
- Consumes: shadcn `Button`, `Input`, `Avatar`, `DropdownMenu*`; `areaLabel`, `findActiveNavItem`
- Produces:
  - `AppTopbar({ onMenuClick }: { onMenuClick: () => void })`
  - `AppPageHeader({ area, sections, pathname }: { area: NavArea; sections: NavSection[]; pathname: string })`

- [ ] **Step 1: Implement `AppTopbar`**

```tsx
// components/layout/app-topbar.tsx
"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <MenuIcon className="size-5" />
      </Button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-9"
          readOnly
          aria-label="Search"
        />
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full" />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback>TK</AvatarFallback>
            </Avatar>
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
```

Note: If `DropdownMenuTrigger` in this repo does not support `render=`, match the existing pattern in any file that uses it, or wrap children the same way other portal menus do. Prefer copying the exact trigger API from `components/ui/dropdown-menu.tsx` exports usage — inspect that file and adjust to the Base UI / shadcn pattern already in the project (do not invent a second API).

- [ ] **Step 2: Implement `AppPageHeader`**

```tsx
// components/layout/app-page-header.tsx
"use client";

import { areaLabel, findActiveNavItem } from "@/lib/navigation";
import type { NavArea, NavSection } from "@/types/navigation";

export function AppPageHeader({
  area,
  sections,
  pathname,
}: {
  area: NavArea;
  sections: NavSection[];
  pathname: string;
}) {
  const active = findActiveNavItem(sections, pathname);
  const title =
    active?.label ??
    pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ??
    "Home";
  const crumb = `${areaLabel(area)} / ${title}`;

  return (
    <div className="border-b border-border bg-background px-4 py-4 lg:px-6">
      <p className="text-sm text-muted-foreground">{crumb}</p>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/app-topbar.tsx components/layout/app-page-header.tsx
git commit -m "feat: add app top bar and page header"
```

---

### Task 5: `AppShell` + wire layouts + stub dashboard pages

**Files:**
- Create: `components/layout/app-shell.tsx`
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `app/(backoffice)/layout.tsx`
- Create: `app/(dashboard)/home/page.tsx`
- Create: `app/(dashboard)/products/page.tsx`
- Create: `app/(dashboard)/orders/page.tsx`
- Create: `app/(dashboard)/analytics/page.tsx`
- Create: `app/(dashboard)/settings/page.tsx`

**Interfaces:**
- Consumes: `useNavigation`, `AppSidebar`, `AppTopbar`, `AppPageHeader`, `Sheet` / `SheetContent`, `usePathname`
- Produces: `AppShell({ area, children }: { area: NavArea; children: React.ReactNode })`

- [ ] **Step 1: Implement `AppShell`**

```tsx
// components/layout/app-shell.tsx
"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useNavigation } from "@/hooks/use-navigation";
import type { NavArea } from "@/types/navigation";

export function AppShell({
  area,
  children,
}: {
  area: NavArea;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useNavigation(area);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = data?.sections ?? [];

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <div className="hidden lg:block">
        <AppSidebar
          data={data}
          pathname={pathname}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <AppSidebar
            data={data}
            pathname={pathname}
            isLoading={isLoading}
            isError={isError}
            onNavigate={() => setMobileOpen(false)}
            className="border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onMenuClick={() => setMobileOpen(true)} />
        <AppPageHeader area={area} sections={sections} pathname={pathname} />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

Inspect `components/ui/sheet.tsx` and align `Sheet` / `SheetContent` props (`side`, controlled `open` / `onOpenChange`) with the actual Base UI API exported there. If the root uses different prop names, adapt to that file’s exports only.

- [ ] **Step 2: Wire layouts**

```tsx
// app/(dashboard)/layout.tsx
import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

type Props = { children: ReactNode };

export default function DashboardLayout({ children }: Props) {
  return <AppShell area="dashboard">{children}</AppShell>;
}
```

```tsx
// app/(backoffice)/layout.tsx
import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

type Props = { children: ReactNode };

export default function BackofficeLayout({ children }: Props) {
  return <AppShell area="backoffice">{children}</AppShell>;
}
```

- [ ] **Step 3: Add dashboard stub pages** (same pattern each file)

```tsx
// app/(dashboard)/home/page.tsx
export default function HomePage() {
  return <div className="rounded-lg border border-border bg-card p-6">Home</div>;
}
```

Repeat for `products`, `orders`, `analytics`, `settings` with matching titles inside the card.

- [ ] **Step 4: Manual verification**

With `npm run dev`:

1. Open `/home` — desktop sidebar expanded, top bar, breadcrumb `Dashboard / Home`, Network request to `/data/navigation/dashboard.json`.
2. Click Orders — active style moves; header becomes `Dashboard / Orders`.
3. Open `/backoffice/users` — backoffice JSON loads; Users active.
4. Narrow viewport — hamburger opens Sheet; choosing a link closes it.

- [ ] **Step 5: Commit**

```bash
git add components/layout/app-shell.tsx app/(dashboard) app/(backoffice)
git commit -m "feat: wire Shopify-style AppShell into dashboard and backoffice"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Shared shell for dashboard + backoffice | 5 |
| Sidebar + top bar + page header | 3–5 |
| Desktop always expanded / mobile Sheet | 5 |
| Static JSON under public + client fetch + RQ | 1–2, 5 |
| JSON contract + dummy content | 1 |
| Active pathname matching | 1, 3 |
| Loading skeletons + error copy | 3 |
| shadcn + tokens only | 3–5 |
| Stub dashboard routes | 5 |
| Out of scope items omitted | all |

## Placeholder / consistency review

- Types and helper names are consistent across tasks (`NavArea`, `isNavItemActive`, `findActiveNavItem`, `areaLabel`, `useNavigation`, `AppShell`).
- DropdownMenu / Sheet APIs must be verified against existing `components/ui/*` during Tasks 4–5 (called out explicitly; not left as TBD).
- No nested subnav UI in v1 (schema may include unused `children`).
