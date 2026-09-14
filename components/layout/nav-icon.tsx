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
