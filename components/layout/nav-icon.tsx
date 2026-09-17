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
  Megaphone,
  Mail,
  Package,
  ScrollText,
  Settings,
  ShoppingCart,
  Sparkles,
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
  Sparkles,
  Megaphone,
  Mail,
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
