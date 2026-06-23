"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Clock, Share2, Sparkles } from "lucide-react";
import {
  Pill,
  PriceTag,
  RatingInline,
  RatingStars,
  SectionHeader,
} from "@/components/shared/primitives";
import { ChoiceChip } from "@/components/shared/chips";
import { ReviewCard } from "@/components/shared/review-card";
import { MediaImage, PersonAvatar } from "@/components/shared/media-image";
import { SaveButton } from "@/components/shared/save-button";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { StackHeader, IconButton } from "@/components/shell/headers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/providers/toast-provider";
import {
  getBusiness,
  getService,
  reviewsForBusiness,
  reviewsForService,
  staffForBusiness,
} from "@/lib/mock";
import type { ServiceVariation } from "@/lib/mock/types";
import { VERTICAL_META } from "@/lib/taxonomy";
import { fmtDuration } from "@/lib/datetime";

const GOOD_TO_KNOW: ReadonlyArray<string> = [
  "Free cancellation up to 24 hours before your appointment.",
  "Please arrive 10 minutes early to settle in and complete any intake.",
  "Let your therapist know about allergies, injuries or sensitivities beforehand.",
  "Phones on silent — this is your time to switch off.",
];

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const service = getService(id);
  const business = service ? getBusiness(service.businessId) : undefined;
  const { toast } = useToast();

  const [selected, setSelected] = React.useState(0);

  if (!service || !business) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">We couldn&apos;t find that service</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed or is no longer offered.
          </p>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to discover
        </Link>
      </div>
    );
  }

  const meta = VERTICAL_META[business.vertical];
  const therapist = staffForBusiness(business.id)[0];
  const serviceReviews = reviewsForService(service.id);
  const reviews =
    serviceReviews.length > 0 ? serviceReviews : reviewsForBusiness(business.id);

  // Variation list — fall back to a single "Standard" option from the base service.
  const variations: ServiceVariation[] =
    service.variations.length > 0
      ? service.variations
      : [
          {
            name: "Standard",
            durationMin: service.durationMin,
            price: service.price,
          },
        ];

  const safeSelected = Math.min(selected, variations.length - 1);
  const chosen = variations[safeSelected];

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: `Share ${service.name} with a friend`,
      variant: "calm",
    });
  };

  const handleSeeAll = () => {
    toast({
      title: "All reviews",
      description: `${service.reviewCount.toLocaleString()} reviews for ${service.name}`,
      variant: "info",
    });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero */}
      <div className="relative">
        <MediaImage gradient={service.gradient} scrim className="h-64 w-full">
          <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
            <Pill tone="neutral" className="bg-white/20 text-white">
              {service.category}
            </Pill>
            <h1 className="mt-2.5 font-display text-2xl font-semibold leading-tight text-white">
              {service.name}
            </h1>
          </div>
        </MediaImage>

        {/* Floating transparent header */}
        <div className="absolute inset-x-0 top-0">
          <StackHeader
            transparent
            actions={
              <>
                <SaveButton businessId={business.id} businessName={business.name} floating />
                <IconButton label="Share" onClick={handleShare} className="bg-card/85">
                  <Share2 className="h-[1.15rem] w-[1.15rem]" />
                </IconButton>
              </>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* Header block */}
        <section>
          <h2 className="font-display text-xl font-semibold leading-tight">{service.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-muted-foreground">
            <RatingInline rating={service.rating} count={service.reviewCount} className="text-foreground" />
            <span aria-hidden className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {fmtDuration(chosen.durationMin)}
            </span>
            <span aria-hidden className="text-border">·</span>
            <Link
              href={`/business/${business.id}`}
              className="font-semibold text-primary"
            >
              {business.name}
            </Link>
          </div>
        </section>

        {/* Choose an option */}
        <section>
          <SectionHeader title="Choose an option" caption="Pick a length that suits you" />
          <div className="space-y-2.5">
            {variations.map((v, i) => {
              const active = i === safeSelected;
              return (
                <button
                  key={`${v.name}-${i}`}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={active}
                  className={
                    active
                      ? "flex w-full items-center gap-3 rounded-3xl border border-primary bg-primary-soft p-4 text-start transition-all"
                      : "flex w-full items-center gap-3 rounded-3xl border bg-card p-4 text-start transition-all active:scale-[0.99] hover:bg-muted"
                  }
                >
                  <span
                    className={
                      active
                        ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        : "h-5 w-5 shrink-0 rounded-full border-2 border-border"
                    }
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{v.name}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {fmtDuration(v.durationMin)}
                    </p>
                  </div>
                  <PriceTag amount={v.price} className="text-sm" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Description */}
        <section>
          <SectionHeader title="About this treatment" />
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">
            {service.description}
          </p>
        </section>

        {/* What's included */}
        {service.includedItems.length > 0 && (
          <section>
            <SectionHeader title="What's included" />
            <ul className="space-y-2.5">
              {service.includedItems.map((item) => (
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

        {/* Your therapist */}
        {therapist && (
          <section>
            <SectionHeader title={`Your ${meta.label.toLowerCase().includes("hair") ? "stylist" : "therapist"}`} />
            <Link
              href={`/business/${business.id}`}
              className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]"
            >
              <PersonAvatar
                name={therapist.name}
                gradient={therapist.avatarGradient}
                className="h-14 w-14"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{therapist.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{therapist.role}</p>
                <div className="mt-1.5">
                  <RatingInline rating={therapist.rating} count={therapist.reviewCount} />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section>
            <SectionHeader
              title="Reviews"
              actionLabel={reviews.length > 3 ? "See all" : undefined}
              onAction={handleSeeAll}
            />
            <div className="mb-4 flex items-center gap-4 rounded-3xl border bg-card p-4">
              <div className="text-center">
                <p className="font-display text-3xl font-semibold leading-none tabular-nums">
                  {service.rating.toFixed(1)}
                </p>
                <div className="mt-1.5 flex justify-center">
                  <RatingStars rating={service.rating} />
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {service.reviewCount.toLocaleString()} reviews
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  From verified visits
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}

        {/* Good to know */}
        <section>
          <SectionHeader title="Good to know" />
          <Accordion type="single" collapsible className="rounded-3xl border bg-card px-4">
            <AccordionItem value="policy" className="border-none">
              <AccordionTrigger>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Cancellation &amp; what to expect
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2.5">
                  {GOOD_TO_KNOW.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{line}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>

      {/* Sticky book CTA */}
      <FlowFooter
        primary={
          <Link href={`/booking/${service.id}?variation=${safeSelected}`} className="block">
            <FooterButton>Book</FooterButton>
          </Link>
        }
      >
        <div>
          <PriceTag amount={chosen.price} className="text-base" />
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {fmtDuration(chosen.durationMin)}
          </p>
        </div>
      </FlowFooter>
    </div>
  );
}
