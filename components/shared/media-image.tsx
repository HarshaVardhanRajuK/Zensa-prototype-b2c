import * as React from "react";
import { gradientCss, gradientFor, MEDIA_SCRIM } from "@/lib/media";
import type { Gradient } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/**
 * Generative "imagery" — calm CSS gradients standing in for photography so the
 * prototype is fully self-contained, always on-brand and loads instantly.
 * A subtle radial sheen + optional scrim give it depth and seat overlay text.
 */
export function MediaImage({
  gradient,
  seed,
  className,
  scrim = false,
  sheen = true,
  children,
}: {
  gradient?: Gradient;
  seed?: string;
  className?: string;
  scrim?: boolean;
  sheen?: boolean;
  children?: React.ReactNode;
}) {
  const g = gradient ?? gradientFor(seed ?? "zensa");
  return (
    <div
      className={cn("relative isolate overflow-hidden bg-muted", className)}
      style={{ backgroundImage: gradientCss(g) }}
    >
      {sheen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 75% 8%, hsl(0 0% 100% / 0.28), transparent 60%)",
          }}
        />
      )}
      {scrim && (
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: MEDIA_SCRIM }} />
      )}
      {children}
    </div>
  );
}

/** Small rounded gradient tile for thumbnails, avatars and icon chips. */
export function GradientThumb({
  gradient,
  seed,
  className,
  children,
}: {
  gradient?: Gradient;
  seed?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const g = gradient ?? gradientFor(seed ?? "zensa");
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl",
        className,
      )}
      style={{ backgroundImage: gradientCss(g) }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 90% at 70% 10%, hsl(0 0% 100% / 0.25), transparent 55%)",
        }}
      />
      <div className="relative z-10 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** Gradient avatar with initials — for people. */
export function PersonAvatar({
  name,
  gradient,
  className,
}: {
  name: string;
  gradient?: Gradient;
  className?: string;
}) {
  const init = name
    .split(/\s+/)
    .filter((w) => !/^(dr\.?|mr\.?|mrs\.?|ms\.?)$/i.test(w))
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <GradientThumb gradient={gradient} seed={name} className={cn("rounded-full", className)}>
      <span className="text-xs font-semibold text-white">{init}</span>
    </GradientThumb>
  );
}
