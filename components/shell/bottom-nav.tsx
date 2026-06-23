"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV, isNavActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Hide the bottom nav on full-screen flows (booking, checkout, etc.). */
const HIDE_ON = ["/booking", "/checkout", "/stays/booking", "/store/checkout", "/store/cart", "/notifications"];

/** Detail screens carry their own sticky CTA footer — hide nav so they don't collide. */
const DETAIL_ROUTE = /^\/(business|service|stays|programs|bookings|store\/product)\/.+/;

export function BottomNav() {
  const pathname = usePathname();
  if (HIDE_ON.some((p) => pathname.startsWith(p)) || DETAIL_ROUTE.test(pathname)) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-app">
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent" />
      <div className="relative border-t border-border/70 bg-card/85 px-2 pb-safe pt-1.5 backdrop-blur-xl">
        <ul className="flex items-stretch justify-around">
          {BOTTOM_NAV.map((item) => {
            const active = isNavActive(item.href, pathname);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "group flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.center ? (
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl transition-all",
                        active
                          ? "bg-primary text-primary-foreground shadow-float"
                          : "bg-primary-soft text-primary",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active && "animate-breathe")} strokeWidth={2} />
                    </span>
                  ) : (
                    <span className="flex h-8 items-center justify-center">
                      <Icon
                        className={cn("h-[1.35rem] w-[1.35rem]")}
                        strokeWidth={active ? 2.4 : 2}
                        fill={active ? "currentColor" : "none"}
                        fillOpacity={active ? 0.12 : 0}
                      />
                    </span>
                  )}
                  <span className={cn("text-[0.625rem] font-semibold tracking-wide", item.center && "mt-0")}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
