import * as React from "react";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { formatMoney, type Money } from "@/lib/money";
import { fmtCount, fmtRating } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Section heading with an optional "See all" action. */
export function SectionHeader({
  title,
  caption,
  actionLabel,
  actionHref,
  onAction,
  className,
}: {
  title: string;
  caption?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  const action =
    actionLabel &&
    (actionHref ? (
      <Link
        href={actionHref}
        className="flex items-center gap-0.5 text-[0.8125rem] font-semibold text-primary"
      >
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    ) : (
      <button
        onClick={onAction}
        className="flex items-center gap-0.5 text-[0.8125rem] font-semibold text-primary"
      >
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    ));

  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-[1.0625rem] font-semibold tracking-tight">{title}</h2>
        {caption && <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{caption}</p>}
      </div>
      {action}
    </div>
  );
}

/** Inline rating, e.g. ★ 4.9 (1.2k). */
export function RatingInline({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.8125rem] font-semibold", className)}>
      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
      <span className="tabular-nums">{fmtRating(rating)}</span>
      {count !== undefined && (
        <span className="font-normal text-muted-foreground">({fmtCount(count)})</span>
      )}
    </span>
  );
}

/** Five-star display for review cards. */
export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= Math.round(rating) ? "fill-gold text-gold" : "fill-muted text-muted",
          )}
        />
      ))}
    </span>
  );
}

/** Price label, with optional "from" prefix and strikethrough compare-at. */
export function PriceTag({
  amount,
  from,
  compareAt,
  suffix,
  className,
}: {
  amount: Money;
  from?: boolean;
  compareAt?: Money;
  suffix?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      {from && <span className="text-xs font-normal text-muted-foreground">from</span>}
      <span className="font-semibold tabular-nums">{formatMoney(amount)}</span>
      {compareAt && (
        <span className="text-xs font-normal text-muted-foreground line-through">
          {formatMoney(compareAt)}
        </span>
      )}
      {suffix && <span className="text-xs font-normal text-muted-foreground">{suffix}</span>}
    </span>
  );
}

type Tone = "neutral" | "primary" | "clay" | "gold" | "success";

const PILL_TONE: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  clay: "bg-clay-soft text-clay",
  gold: "bg-gold/15 text-gold",
  success: "bg-success/12 text-success",
};

/** Small soft label chip. */
export function Pill({
  children,
  tone = "neutral",
  className,
  icon: Icon,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        PILL_TONE[tone],
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

/** Icon + label + value row used in detail screens. */
export function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 py-2.5", className)}>
      <Icon className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{label}</p>
        {value && <div className="mt-0.5 text-sm text-muted-foreground">{value}</div>}
      </div>
    </div>
  );
}
