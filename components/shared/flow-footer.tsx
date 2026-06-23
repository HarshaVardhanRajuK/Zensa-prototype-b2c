import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom action bar for detail & flow screens — an optional summary on
 * the start side and a primary CTA on the end side. Sits above the safe area.
 */
export function FlowFooter({
  children,
  primary,
  className,
}: {
  children?: React.ReactNode;
  primary: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="sticky bottom-0 z-30 mt-auto">
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
      <div
        className={cn(
          "flex items-center gap-3 border-t border-border/60 bg-card/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.875rem)] pt-3.5 backdrop-blur-xl",
          className,
        )}
      >
        {children && <div className="min-w-0 flex-1">{children}</div>}
        <div className={cn(!children && "flex-1")}>{primary}</div>
      </div>
    </div>
  );
}

/** Convenience CTA matching the footer's button sizing. */
export function FooterButton({
  children,
  onClick,
  disabled,
  className,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "clay" | "outline";
}) {
  return (
    <Button
      size="lg"
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn(!className?.includes("w-") && "w-full", className)}
    >
      {children}
    </Button>
  );
}
