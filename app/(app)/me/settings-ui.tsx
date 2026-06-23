"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Local building blocks for the "Me" surface — a consistent settings row
 * (soft icon tile + label + chevron, optional value/description) and a
 * grouped container. LOCAL to me/ only; not a shared primitive.
 */

export function SettingsGroup({
  title,
  caption,
  prominent = false,
  children,
}: {
  title?: string;
  caption?: string;
  prominent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-6">
      {title && (
        <div className="mb-2.5 ps-1">
          <h2
            className={cn(
              "text-[0.8125rem] font-semibold uppercase tracking-wide",
              prominent ? "text-primary" : "text-muted-foreground",
            )}
          >
            {title}
          </h2>
          {caption && <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>}
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-3xl border bg-card",
          prominent && "border-primary/25 shadow-card",
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface RowProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  value?: React.ReactNode;
  tone?: "default" | "primary";
}

function RowInner({ icon: Icon, label, description, value, tone = "default" }: RowProps) {
  return (
    <>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
          tone === "primary" ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
        )}
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{description}</p>
        )}
      </div>
      {value !== undefined && (
        <span className="shrink-0 text-sm text-muted-foreground">{value}</span>
      )}
    </>
  );
}

/** Settings row that links to a subpage. */
export function SettingsLinkRow({ href, ...row }: RowProps & { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 border-b border-border/60 px-4 py-3.5 transition-colors last:border-b-0 active:bg-muted/50"
    >
      <RowInner {...row} />
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

/** Settings row that fires an action (no navigation). */
export function SettingsActionRow({
  onClick,
  showChevron = true,
  ...row
}: RowProps & { onClick: () => void; showChevron?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 border-b border-border/60 px-4 py-3.5 text-start transition-colors last:border-b-0 active:bg-muted/50"
    >
      <RowInner {...row} />
      {showChevron && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </button>
  );
}

/** A plain stacked row holding arbitrary controls (switch, select, etc.). */
export function ControlRow({
  icon: Icon,
  label,
  description,
  control,
}: {
  icon?: LucideIcon;
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-border/60 px-4 py-3.5 last:border-b-0">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-[1.15rem] w-[1.15rem]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
