"use client";

import * as React from "react";
import Link from "next/link";
import { GradientThumb } from "@/components/shared/media-image";
import type { Gradient } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/** Round category entry — icon tile + label, used in Discover & search. */
export function CategoryChip({
  label,
  icon: Icon,
  gradient,
  href,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: Gradient;
  href?: string;
  onClick?: () => void;
}) {
  const body = (
    <span className="flex w-16 shrink-0 flex-col items-center gap-1.5">
      <GradientThumb gradient={gradient} className="h-16 w-16 rounded-3xl">
        <Icon className="h-6 w-6 text-white" />
      </GradientThumb>
      <span className="text-center text-[0.6875rem] font-medium leading-tight text-foreground">{label}</span>
    </span>
  );
  if (href) return <Link href={href}>{body}</Link>;
  return (
    <button type="button" onClick={onClick}>
      {body}
    </button>
  );
}

/** Selectable filter / choice chip (segmented or multi-select). */
export function ChoiceChip({
  children,
  selected,
  onClick,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[0.8125rem] font-medium transition-all active:scale-[0.97]",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
