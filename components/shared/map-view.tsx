"use client";

import * as React from "react";
import Link from "next/link";
import { Navigation } from "lucide-react";
import { gradientCss } from "@/lib/media";
import { VERTICAL_META } from "@/lib/taxonomy";
import type { Business } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Stylised map placeholder with positioned pins (no real map SDK — the
 * prototype is self-contained). Pins use each business's normalized mapX/mapY.
 */
export function MapView({
  businesses,
  className,
  selectedId,
  onSelect,
}: {
  businesses: Business[];
  className?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-[hsl(150_20%_92%)]",
        className,
      )}
    >
      {/* Soft terrain wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 30% 30%, hsl(150 30% 86%), transparent), radial-gradient(50% 60% at 80% 70%, hsl(200 35% 86%), transparent)",
        }}
      />
      {/* Faux roads */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path d="M0,120 Q150,80 300,160 T600,140" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="6" fill="none" />
        <path d="M120,0 Q160,150 80,300 T140,600" stroke="hsl(0 0% 100% / 0.6)" strokeWidth="5" fill="none" />
        <path d="M0,260 Q200,240 420,300 T700,280" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="4" fill="none" />
      </svg>

      {businesses.map((b) => {
        const Icon = VERTICAL_META[b.vertical].icon;
        const active = b.id === selectedId;
        return (
          <button
            key={b.id}
            onClick={() => onSelect?.(b.id)}
            className="absolute -translate-x-1/2 -translate-y-full transition-transform active:scale-95"
            style={{ left: `${b.mapX * 100}%`, top: `${b.mapY * 100}%` }}
            aria-label={b.name}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white shadow-float transition-all",
                active && "scale-125",
              )}
              style={{ backgroundImage: gradientCss(b.gradient) }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="mx-auto -mt-1 block h-2 w-2 rotate-45 border-b-2 border-e-2 border-white bg-card" style={{ backgroundImage: gradientCss(b.gradient) }} />
          </button>
        );
      })}

      {/* "You" marker */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="block h-3.5 w-3.5 rounded-full bg-info ring-4 ring-info/30" />
      </span>

      <div className="absolute end-3 top-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground shadow-sm">
          <Navigation className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

/** Selected-pin preview card shown over the map. */
export function MapPinCard({ business }: { business: Business }) {
  const meta = VERTICAL_META[business.vertical];
  return (
    <Link
      href={`/business/${business.id}`}
      className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-float"
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
        style={{ backgroundImage: gradientCss(business.gradient) }}
      >
        <meta.icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{business.name}</p>
        <p className="text-xs text-muted-foreground">
          {meta.label} · {business.neighborhood}
        </p>
      </div>
    </Link>
  );
}
