import assert from "node:assert/strict";
import { isNavItemActive, findActiveNavItem, areaLabel } from "./navigation";
import type { NavSection } from "../types/navigation";

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

const nested: NavSection[] = [
  {
    id: "main",
    label: null,
    items: [
      {
        id: "reports",
        label: "Reports",
        href: "#",
        icon: "BarChart3",
        children: [
          {
            id: "analytics",
            label: "Analytics",
            href: "/analytics",
            icon: "BarChart3",
          },
        ],
      },
    ],
  },
];
assert.equal(findActiveNavItem(nested, "/analytics")?.id, "analytics");

assert.equal(areaLabel("dashboard"), "Dashboard");
assert.equal(areaLabel("backoffice"), "Backoffice");

console.log("navigation.selfcheck: ok");
