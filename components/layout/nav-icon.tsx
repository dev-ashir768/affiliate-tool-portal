import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  BarChart3,
  Bot,
  Building2,
  Circle,
  CreditCard,
  Globe,
  Home,
  Package,
  ScrollText,
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
  CreditCard,
  Building2,
  BadgeDollarSign,
  ScrollText,
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
