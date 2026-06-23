"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Moon,
  Sparkles,
  Users,
} from "lucide-react";
import { EntityHeader } from "@/components/shared/entity-header";
import {
  Pill,
  PriceTag,
  RatingInline,
  SectionHeader,
} from "@/components/shared/primitives";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CONSUMER_STAYS, getBusiness, getStay } from "@/lib/mock";
import type { ItineraryItem } from "@/lib/mock/types";
import { fmtDateRange } from "@/lib/datetime";
import { STAY_STATUS } from "@/lib/status";

const ITEM_DOT: Record<ItineraryItem["type"], string> = {
  consultation: "bg-primary",
  service: "bg-clay",
  class: "bg-info",
  assessment: "bg-gold",
  product: "bg-success",
  meal: "bg-warning",
  free: "bg-muted-foreground",
};

export default function StayDetailPage() {
  const params = useParams<{ id: string }>();
  const stay = getStay(params.id);
  const business = stay ? getBusiness(stay.businessId) : undefined;

  if (!stay) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Moon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">We couldn&apos;t find that retreat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have moved or is no longer offered.
          </p>
        </div>
        <Link
          href="/stays"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to retreats
        </Link>
      </div>
    );
  }

  const booked = CONSUMER_STAYS.find((cs) => cs.stayId === stay.id);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <EntityHeader
        gallery={stay.gallery}
        title={stay.name}
        subtitle={stay.location}
        meta={
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-white/90">
            <RatingInline
              rating={stay.rating}
              count={stay.reviewCount}
              className="text-white"
            />
            <Pill tone="neutral" className="bg-white/20 text-white">
              <Moon className="h-3 w-3" />
              {stay.nights} nights
            </Pill>
          </div>
        }
      />

      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* You're booked */}
        {booked && (
          <Link href={`/stays/${stay.id}`} className="block">
            <div className="flex items-center gap-3 rounded-3xl border border-primary/30 bg-primary-soft p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <p className="text-sm font-semibold">You&apos;re booked</p>
                  <Badge variant={STAY_STATUS[booked.status].variant}>
                    {STAY_STATUS[booked.status].label}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {fmtDateRange(booked.checkInIso, booked.checkOutIso)} · {booked.roomType}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </div>
          </Link>
        )}

        {/* Summary + description */}
        <section>
          <p className="text-[0.9375rem] font-medium leading-relaxed text-foreground">
            {stay.summary}
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/80">
            {stay.description}
          </p>
        </section>

        {/* Highlights */}
        {stay.highlights.length > 0 && (
          <section>
            <SectionHeader title="Highlights" />
            <div className="flex flex-wrap gap-2">
              {stay.highlights.map((h) => (
                <Pill key={h} tone="primary">
                  {h}
                </Pill>
              ))}
            </div>
          </section>
        )}

        {/* What's included */}
        {stay.inclusions.length > 0 && (
          <section>
            <SectionHeader title="What's included" />
            <ul className="space-y-2.5">
              {stay.inclusions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm leading-snug text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* A day here — sample itinerary */}
        {stay.sampleItinerary.length > 0 && (
          <section>
            <SectionHeader title="A day here" caption="A taste of the daily rhythm" />
            <Tabs defaultValue={String(stay.sampleItinerary[0]?.day)}>
              <TabsList className="no-scrollbar w-full justify-start overflow-x-auto">
                {stay.sampleItinerary.map((d) => (
                  <TabsTrigger key={d.day} value={String(d.day)}>
                    Day {d.day}
                  </TabsTrigger>
                ))}
              </TabsList>
              {stay.sampleItinerary.map((d) => (
                <TabsContent key={d.day} value={String(d.day)}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {d.label}
                  </p>
                  <ul className="space-y-3">
                    {d.items.map((it, i) => (
                      <li key={`${it.time}-${i}`} className="flex items-start gap-3">
                        <span className="w-12 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                          {it.time}
                        </span>
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${ITEM_DOT[it.type]}`}
                        />
                        <span className="text-sm leading-snug text-foreground/90">{it.title}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}

        {/* Rooms */}
        {stay.roomTypes.length > 0 && (
          <section>
            <SectionHeader title="Rooms" caption="Per-night rates" />
            <div className="space-y-3">
              {stay.roomTypes.map((room) => (
                <article key={room.name} className="rounded-3xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">{room.name}</h3>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                        {room.description}
                      </p>
                    </div>
                    <PriceTag amount={room.pricePerNight} suffix="/night" className="shrink-0 text-sm" />
                  </div>
                  <p className="mt-2.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Sleeps {room.capacity}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Location / host */}
        {business && (
          <section>
            <SectionHeader title="Hosted by" />
            <Link
              href={`/business/${business.id}`}
              className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{business.name}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {business.neighborhood} · {business.city}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <FlowFooter
        primary={
          <Link href={`/stays/booking/${stay.id}`} className="block">
            <FooterButton>
              Check availability
              <ArrowRight className="h-4 w-4" />
            </FooterButton>
          </Link>
        }
      >
        <div>
          <p className="text-xs text-muted-foreground">from</p>
          <PriceTag amount={stay.fromPrice} className="text-base" />
        </div>
      </FlowFooter>
    </div>
  );
}
