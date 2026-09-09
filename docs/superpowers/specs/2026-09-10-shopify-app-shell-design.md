# Shopify-style App Shell Design

Date: 2026-09-10  
Status: Approved for implementation planning  
Scope: Shared portal chrome (sidebar + top bar + page header) for dashboard and backoffice

## Goal

Make the affiliate portal feel like Shopify Admin: fixed left navigation, top bar, and a title/breadcrumb strip above page content. Navigation is API-shaped and loaded from dummy JSON for now so a real backend can replace it later without rewriting the shell.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Where | Both `(dashboard)` and `(backoffice)` via shared shell |
| Chrome | Sidebar + top bar + page title/breadcrumb |
| Desktop sidebar | Always expanded (~240px) |
| Mobile sidebar | Sheet drawer (hamburger) |
| Nav data source | Static JSON under `public/data/navigation/`, client `fetch` + React Query |
| Architecture | Single `AppShell` with `area: "dashboard" \| "backoffice"` |

## Architecture

```
public/data/navigation/
  dashboard.json
  backoffice.json

types/navigation.ts
hooks/use-navigation.ts

components/layout/
  app-shell.tsx
  app-sidebar.tsx
  app-topbar.tsx
  app-page-header.tsx
  nav-item.tsx
  nav-icon.tsx          # lucide name → component map

app/(dashboard)/layout.tsx   → <AppShell area="dashboard">{children}</AppShell>
app/(backoffice)/layout.tsx  → <AppShell area="backoffice">{children}</AppShell>
```

### Data flow

1. Layout mounts `AppShell` with `area`.
2. `useNavigation(area)` fetches `/data/navigation/{area}.json`.
3. Sidebar / mobile Sheet render sections + items from the response.
4. Active item is derived from `usePathname()` (`===` or prefix match for nested routes).
5. Page header title/breadcrumb come from the active nav item (fallback: last path segment).

### Swap to real API later

Change the fetch URL inside `useNavigation` (or a thin `lib/api/navigation.ts`) to the backend endpoint. JSON shape stays the same.

## Navigation JSON contract

```ts
type NavBrand = {
  name: string;
  href: string;
};

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;       // lucide export name, e.g. "Home"
  badge?: string;
  children?: NavItem[]; // reserved; v1 may omit nesting UI
};

type NavSection = {
  id: string;
  label: string | null; // null = unlabeled primary block
  items: NavItem[];
};

type NavResponse = {
  area: "dashboard" | "backoffice";
  brand: NavBrand;
  sections: NavSection[];
};
```

### Dummy content (v1)

**Dashboard** (`dashboard.json`):

- Brand: Tiksly → `/home` (or `/`)
- Sections:
  - (unlabeled): Home `/home`, Products `/products`, Orders `/orders` (badge optional)
  - Analytics: Analytics `/analytics`
  - Settings: Settings `/settings`

Stub pages should be added under `(dashboard)` for these routes so the shell is navigable.

**Backoffice** (`backoffice.json`):

- Brand: Tiksly Backoffice → `/backoffice/users`
- Sections:
  - (unlabeled): Users `/backoffice/users`, Shops `/backoffice/shops`, Proxies `/backoffice/proxies`, Crawler `/backoffice/crawler`

Existing stub pages under `app/(backoffice)/backoffice/*` already match these hrefs.

## UI / visual spec

Use existing tokens from `globals.css` only (`sidebar-*`, `background`, `muted`, `border`, `foreground`). shadcn-first: compose from `Button`, `Sheet`, `Avatar`, `DropdownMenu`, `Input`, `Separator`, `Badge`.

### Layout grid

- Desktop: `flex` row — fixed sidebar width (~`w-60`) + column (`topbar` → `page-header` → `main`).
- Mobile: no persistent sidebar; top bar includes menu button opening `Sheet` with the same nav tree.
- Main canvas: light muted background (`bg-muted/40` or equivalent token usage); content area padded.

### Sidebar

- `bg-sidebar`, `border-r border-sidebar-border`, full viewport height.
- Top: brand name (text link).
- Sections: optional muted section label; list of nav rows.
- Nav row: icon + label (+ optional badge); `rounded-lg`; hover/active use `sidebar-accent`.
- Active: pathname equals `href`, or pathname starts with `href + "/"` when `href` is not `/`.

### Top bar

- White / `bg-background`, bottom border.
- Left: mobile menu button (hidden `lg+`); optional search `Input` (non-functional placeholder).
- Right: `Avatar` + `DropdownMenu` (placeholder items: Profile, Logout — no real auth wiring).

### Page header

- Below top bar, above children.
- Title: active item `label`.
- Breadcrumb: `{Area label} / {Page label}` (e.g. `Dashboard / Orders`, `Backoffice / Users`).

## Component responsibilities

| Component | Responsibility |
|-----------|----------------|
| `AppShell` | Orchestrates chrome; owns mobile sheet open state; wraps children |
| `AppSidebar` | Desktop nav from `NavResponse`; brand + sections |
| `AppTopbar` | Search placeholder, user menu, mobile trigger |
| `AppPageHeader` | Title + breadcrumb from active item / area |
| `NavItem` | Single link row + active styles |
| `useNavigation` | React Query fetch + typing + loading/error states |

### Loading / error

- Loading: skeleton rows in sidebar (and sheet); shell chrome still renders.
- Error: muted message in sidebar (“Couldn’t load navigation”) with no crash of page content.

## Out of scope (v1)

- Real authentication / session
- Store / org switcher
- Collapsible icon-rail sidebar
- Working global search
- Nested expandable subnav UI (schema may allow `children` unused)
- Dark-mode-specific shell polish beyond existing tokens

## Success criteria

- Visiting any dashboard or backoffice route shows Shopify-like chrome.
- Nav items come from fetched JSON (Network tab shows the request), not hardcoded in the sidebar component.
- Dashboard and backoffice share one shell; only JSON (and `area`) differ.
- Desktop: expanded sidebar; mobile: Sheet drawer.
- Active route is visually highlighted; page header updates with navigation.
- UI uses shadcn + design tokens only (portal-design rule).
