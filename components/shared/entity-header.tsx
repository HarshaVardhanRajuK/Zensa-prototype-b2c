"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GalleryCarousel } from "@/components/shared/gallery-carousel";
import type { Gradient } from "@/lib/mock/types";

/**
 * Hero header for entity detail screens (business, stay).
 * A swipeable gallery with a floating back button + actions and an
 * overlaid title block.
 */
export function EntityHeader({
  gallery,
  title,
  subtitle,
  meta,
  actions,
  height = "h-72",
}: {
  gallery: Gradient[];
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  height?: string;
}) {
  const router = useRouter();
  return (
    <div className="relative">
      <GalleryCarousel slides={gallery} className={height}>
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 pt-[calc(env(safe-area-inset-top)+0.625rem)]">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[5] p-5 pb-8">
          <h1 className="font-display text-2xl font-semibold leading-tight text-white drop-shadow-sm">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-white/85">{subtitle}</p>}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
      </GalleryCarousel>
    </div>
  );
}
