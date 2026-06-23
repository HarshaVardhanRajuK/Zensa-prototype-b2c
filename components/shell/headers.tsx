"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useSearch } from "@/components/shell/search-overlay";
import { useAppStore } from "@/components/providers/app-store";
import { cn } from "@/lib/utils";

/** Round icon button used across headers. */
export function IconButton({
  label,
  onClick,
  href,
  children,
  className,
  badge,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  badge?: number;
}) {
  const inner = (
    <span
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted",
        className,
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.625rem] font-bold text-clay-foreground">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </span>
  );
  if (href) return <Link href={href} aria-label={label}>{inner}</Link>;
  return (
    <button type="button" aria-label={label} onClick={onClick}>
      {inner}
    </button>
  );
}

export function NotificationsBell() {
  const { unreadCount } = useAppStore();
  return (
    <IconButton label="Notifications" href="/notifications" badge={unreadCount}>
      <Bell className="h-[1.15rem] w-[1.15rem]" />
    </IconButton>
  );
}

export function SearchButton() {
  const { open } = useSearch();
  return (
    <IconButton label="Search" onClick={open}>
      <Search className="h-[1.15rem] w-[1.15rem]" />
    </IconButton>
  );
}

/**
 * Context (pushed) screen header with a back affordance.
 * `transparent` floats it over a hero with no background.
 */
export function StackHeader({
  title,
  transparent = false,
  actions,
  backHref,
}: {
  title?: string;
  transparent?: boolean;
  actions?: React.ReactNode;
  backHref?: string;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top)+0.625rem)]",
        transparent ? "bg-transparent" : "border-b border-border/60 bg-background/85 backdrop-blur-xl",
      )}
    >
      <button
        type="button"
        aria-label="Back"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
          transparent ? "bg-card/80 text-foreground shadow-sm backdrop-blur hover:bg-card" : "text-foreground hover:bg-muted",
        )}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      {title && <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>}
      {!title && <div className="flex-1" />}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Root tab header — large display title with search + notifications. */
export function TabHeader({
  title,
  subtitle,
  showSearch = true,
  showBell = true,
  action,
}: {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showBell?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/85 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+1rem)] backdrop-blur-xl">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight">{title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 pb-1">
          {action}
          {showSearch && <SearchButton />}
          {showBell && <NotificationsBell />}
        </div>
      </div>
    </header>
  );
}
