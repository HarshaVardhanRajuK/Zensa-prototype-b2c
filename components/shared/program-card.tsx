import * as React from "react";
import Link from "next/link";
import { CalendarRange, Layers } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { PriceTag } from "@/components/shared/primitives";
import { getBusiness } from "@/lib/mock";
import type { Program } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/** Marketing card for a program (browse / enrol). */
export function ProgramCard({ program, className }: { program: Program; className?: string }) {
  const business = getBusiness(program.businessId);
  return (
    <Link href={`/programs/${program.id}`} className={cn("block", className)}>
      <article className="overflow-hidden rounded-3xl border bg-card shadow-card transition-transform active:scale-[0.99]">
        <MediaImage gradient={program.gradient} scrim className="h-32 w-full">
          <div className="absolute bottom-3 start-4 end-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-foreground backdrop-blur">
              <Layers className="h-3 w-3" />
              {program.category}
            </span>
            <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-white drop-shadow">
              {program.name}
            </h3>
          </div>
        </MediaImage>
        <div className="p-4">
          <p className="line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">{program.summary}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="h-3.5 w-3.5" />
                {program.durationLabel}
              </span>
              <span>{program.sessionsTotal} sessions</span>
            </div>
            <PriceTag amount={program.price} className="text-sm" />
          </div>
          {business && (
            <p className="mt-2 text-xs text-muted-foreground">at {business.name}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
