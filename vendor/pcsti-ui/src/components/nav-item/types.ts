import type { IconComponent } from "../icon";
export type NavLeaf = {
  label: string;
  href: string;
  icon?: IconComponent;
  selectedIcon?: IconComponent;
};

export type NavParent = {
  label: string;
  icon?: IconComponent;
  selectedIcon?: IconComponent;
  children: NavLeaf[];
};

export type NavigationItem = NavLeaf | NavParent;

export function isParent(item: NavigationItem): item is NavParent {
  return "children" in item;
}

export function isActivePath(href: string, activePath: string): boolean {
  if (href === "/") return activePath === href;
  return activePath === href || activePath.startsWith(`${href}/`);
}
