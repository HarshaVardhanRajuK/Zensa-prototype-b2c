import * as React from "react";
import Link from "next/link";
import {
  Award,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Flower2,
  Layers,
  MessageSquareQuote,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { GradientThumb } from "@/components/shared/media-image";
import { fmtDateShort } from "@/lib/datetime";
import type { TimelineEvent, TimelineType } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const ICON: Record<TimelineType, LucideIcon> = {
  visit: CalendarCheck,
  milestone: Award,
  purchase: CreditCard,
  membership: Star,
  program: Layers,
  stay: Flower2,
  assessment: ClipboardList,
  review: MessageSquareQuote,
  note: Sparkles,
};

/** Vertical wellness timeline — the spine of the Journey. */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative">
      {events.map((e, i) => {
        const Icon = ICON[e.type];
        const last = i === events.length - 1;
        const body = (
          <div className="flex gap-3.5 pb-1">
            <div className="relative flex flex-col items-center">
              <GradientThumb gradient={e.gradient} className="h-10 w-10 rounded-2xl">
                <Icon className="h-[1.05rem] w-[1.05rem] text-white" />
              </GradientThumb>
              {!last && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className={cn("min-w-0 flex-1", last ? "pb-2" : "pb-5")}>
              <p className="text-xs text-muted-foreground">{fmtDateShort(e.dateIso)}</p>
              <h3 className="mt-0.5 text-sm font-semibold leading-snug">{e.title}</h3>
              {e.businessName && (
                <p className="text-[0.8125rem] text-muted-foreground">{e.businessName}</p>
              )}
              {e.detail && <p className="mt-1 text-[0.8125rem] text-foreground/80">{e.detail}</p>}
            </div>
          </div>
        );
        return (
          <li key={e.id}>
            {e.businessId ? (
              <Link href={`/business/${e.businessId}`} className="block active:opacity-80">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
}
