import * as React from "react";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { RatingInline } from "@/components/shared/primitives";
import { SaveButton } from "@/components/shared/save-button";
import { VERTICAL_META, priceLevelLabel } from "@/lib/taxonomy";
import { fmtDistance } from "@/lib/utils";
import type { Business } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/** Full-width rich discovery card. */
export function BusinessCard({ business }: { business: Business }) {
  const meta = VERTICAL_META[business.vertical];
  return (
    <Link href={`/business/${business.id}`} className="block">
      <article className="overflow-hidden rounded-3xl border bg-card shadow-card transition-transform active:scale-[0.99]">
        <div className="relative">
          <MediaImage gradient={business.gradient} scrim className="h-40 w-full">
            <div className="absolute end-3 top-3">
              <SaveButton businessId={business.id} businessName={business.name} floating />
            </div>
            <div className="absolute bottom-3 start-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
                <meta.icon className="h-3 w-3" />
                {meta.label}
              </span>
              {business.openNow && (
                <span className="rounded-full bg-success/90 px-2.5 py-1 text-xs font-semibold text-success-foreground">
                  Open now
                </span>
              )}
            </div>
          </MediaImage>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-[0.95rem] font-semibold leading-tight">
              {business.name}
              {business.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
            </h3>
            <RatingInline rating={business.rating} count={business.reviewCount} className="shrink-0" />
          </div>
          <p className="mt-1 line-clamp-1 text-[0.8125rem] text-muted-foreground">{business.tagline}</p>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.neighborhood}
            </span>
            {business.distanceKm > 0 && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular-nums">{fmtDistance(business.distanceKm)}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{priceLevelLabel(business.priceLevel)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** Compact card for horizontal scroll rows (Home, collections). */
export function BusinessTile({ business, className }: { business: Business; className?: string }) {
  const meta = VERTICAL_META[business.vertical];
  return (
    <Link href={`/business/${business.id}`} className={cn("block w-44 shrink-0", className)}>
      <article className="transition-transform active:scale-[0.98]">
        <MediaImage gradient={business.gradient} scrim className="h-28 w-full rounded-2xl">
          <div className="absolute end-2 top-2">
            <SaveButton businessId={business.id} businessName={business.name} floating className="h-8 w-8" />
          </div>
          <span className="absolute bottom-2 start-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[0.625rem] font-semibold text-foreground backdrop-blur">
            <meta.icon className="h-2.5 w-2.5" />
            {meta.label.split(" ")[0]}
          </span>
        </MediaImage>
        <h3 className="mt-2 line-clamp-1 text-sm font-semibold">{business.name}</h3>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <RatingInline rating={business.rating} />
          {business.distanceKm > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{fmtDistance(business.distanceKm)}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
