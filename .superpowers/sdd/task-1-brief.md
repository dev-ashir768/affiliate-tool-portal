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
  - `areaLabel(area: NavArea): string` â†’ `"Dashboard"` | `"Backoffice"`

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

- [ ] **Step 3: Run self-check â€” expect FAIL (module missing)**

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

- [ ] **Step 6: Re-run self-check â€” expect PASS**

Run: `npx tsx lib/navigation.selfcheck.ts`  
Expected: `navigation.selfcheck: ok`

- [ ] **Step 7: Commit**

```bash
git add types/navigation.ts public/data/navigation lib/navigation.ts lib/navigation.selfcheck.ts
git commit -m "feat: add nav types, dummy JSON, and active-route helpers"
```

---

