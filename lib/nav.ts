import { Compass, Home, Sparkles, User, Wallet, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Journey is the emotional centre of the app. */
  center?: boolean;
}

/**
 * Approved B2C navigation model (Product Definition, Phase 4):
 * Home · Discover · Journey (centre) · Wallet · Me.
 */
export const BOTTOM_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/journey", label: "Journey", icon: Sparkles, center: true },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/me", label: "Me", icon: User },
];

/** Whether a bottom-nav item should render active for the current path. */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
