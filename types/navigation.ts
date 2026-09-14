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
