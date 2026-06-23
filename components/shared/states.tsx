"use client";

import * as React from "react";
import { CloudOff, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Calm empty state — every holdings/journey surface needs a strong one. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-8 py-14 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {actionLabel && (
        <Button className="mt-5" onClick={onAction} size="pill">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/** Offline placeholder. */
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={CloudOff}
      title="You're offline"
      description="Check your connection. Your bookings and wallet will sync the moment you're back."
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}

/** Skeleton for a vertical list of rich cards. */
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border bg-card">
          <Skeleton className="h-36 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a horizontal carousel row. */
export function RowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-44 shrink-0 space-y-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
