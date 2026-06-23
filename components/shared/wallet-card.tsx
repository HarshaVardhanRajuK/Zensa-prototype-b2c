"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { gradientCss } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { PriceTag, Pill } from "@/components/shared/primitives";
import type { Money } from "@/lib/money";
import type { Gradient } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Apple-Wallet-style holding card — a gradient surface with a headline stat.
 * Used for memberships, packages, subscriptions, gift cards and credits.
 */
export function WalletCard({
  gradient,
  kind,
  title,
  subtitle,
  statValue,
  statLabel,
  meta,
  status,
  progress,
  href,
  icon: Icon,
}: {
  gradient: Gradient;
  kind: string;
  title: string;
  subtitle?: string;
  statValue: string;
  statLabel?: string;
  meta?: string;
  status?: React.ReactNode;
  progress?: { used: number; total: number };
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const pct = progress ? Math.round(((progress.total - progress.used) / progress.total) * 100) : 0;
  const inner = (
    <article
      className="relative isolate overflow-hidden rounded-3xl p-4 text-white shadow-card transition-transform active:scale-[0.99]"
      style={{ backgroundImage: gradientCss(gradient) }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 85% 5%, hsl(0 0% 100% / 0.25), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white/80">
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {kind}
          </div>
          {status}
        </div>
        <h3 className="mt-2.5 text-base font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-white/75">{subtitle}</p>}

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-display text-3xl font-semibold leading-none tabular-nums">{statValue}</p>
            {statLabel && <p className="mt-1 text-xs text-white/75">{statLabel}</p>}
          </div>
          {meta && <p className="pb-0.5 text-xs text-white/80">{meta}</p>}
        </div>

        {progress && (
          <div className="mt-3.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-[0.6875rem] text-white/80">
              {progress.used} of {progress.total} used
            </p>
          </div>
        )}
      </div>
    </article>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

/** Membership / subscription plan card for purchase surfaces. */
export function PlanCard({
  name,
  price,
  period,
  benefits,
  highlight,
  ctaLabel = "Choose plan",
  onChoose,
}: {
  name: string;
  price: Money;
  period: "month" | "year";
  benefits: string[];
  highlight?: boolean;
  ctaLabel?: string;
  onChoose?: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-3xl border bg-card p-5",
        highlight ? "border-primary ring-1 ring-primary/30" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{name}</h3>
        {highlight && <Pill tone="primary">Most popular</Pill>}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <PriceTag amount={price} className="text-2xl font-display" />
        <span className="text-sm text-muted-foreground">/ {period}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground/90">{b}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onChoose}
        variant={highlight ? "default" : "outline"}
        className="mt-5 w-full"
        size="lg"
      >
        {ctaLabel}
      </Button>
    </article>
  );
}
