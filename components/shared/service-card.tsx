import * as React from "react";
import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { PriceTag, RatingInline } from "@/components/shared/primitives";
import { fmtDuration } from "@/lib/datetime";
import type { Service } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/** Row-style service card used on business profiles & service lists. */
export function ServiceCard({ service, href }: { service: Service; href?: string }) {
  return (
    <Link href={href ?? `/service/${service.id}`} className="block">
      <article className="flex items-center gap-3.5 rounded-3xl border bg-card p-3 transition-colors active:scale-[0.99] hover:bg-muted/40">
        <MediaImage gradient={service.gradient} className="h-20 w-20 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold">{service.name}</h3>
            {service.popular && <Flame className="h-3.5 w-3.5 shrink-0 text-clay" />}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {service.description}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {fmtDuration(service.durationMin)}
            </span>
            <span aria-hidden>·</span>
            <RatingInline rating={service.rating} count={service.reviewCount} />
          </div>
        </div>
        <div className="shrink-0 self-end pb-0.5 text-end">
          <PriceTag amount={service.price} from={service.variations.length > 1} className="text-sm" />
        </div>
      </article>
    </Link>
  );
}

/** Compact tile for popular-services carousels. */
export function ServiceTile({ service, className }: { service: Service; className?: string }) {
  return (
    <Link href={`/service/${service.id}`} className={cn("block w-40 shrink-0", className)}>
      <MediaImage gradient={service.gradient} className="h-24 w-full rounded-2xl" />
      <h3 className="mt-2 line-clamp-1 text-sm font-semibold">{service.name}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{fmtDuration(service.durationMin)}</p>
      <PriceTag amount={service.price} className="mt-0.5 text-[0.8125rem]" />
    </Link>
  );
}
