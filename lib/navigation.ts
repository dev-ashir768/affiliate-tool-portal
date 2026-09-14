import type { NavArea, NavItem, NavSection } from "@/types/navigation";

export function isNavItemActive(pathname: string, href: string): boolean {
  if (!href || href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenNavItems(item.children) : []),
  ]);
}

export function findActiveNavItem(
  sections: NavSection[],
  pathname: string
): NavItem | null {
  const items = flattenNavItems(sections.flatMap((s) => s.items));
  const matches = items.filter((item) => isNavItemActive(pathname, item.href));
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.href.length - a.href.length)[0] ?? null;
}

export function areaLabel(area: NavArea): string {
  return area === "dashboard" ? "Dashboard" : "Backoffice";
}
