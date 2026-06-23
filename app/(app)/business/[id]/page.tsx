"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { EntityHeader } from "@/components/shared/entity-header";
import { ServiceCard } from "@/components/shared/service-card";
import { ProgramCard } from "@/components/shared/program-card";
import { ReviewCard } from "@/components/shared/review-card";
import { PlanCard } from "@/components/shared/wallet-card";
import {
  InfoRow,
  Pill,
  PriceTag,
  RatingInline,
  RatingStars,
  SectionHeader,
} from "@/components/shared/primitives";
import { MediaImage, PersonAvatar } from "@/components/shared/media-image";
import { MapView } from "@/components/shared/map-view";
import { SaveButton } from "@/components/shared/save-button";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { IconButton } from "@/components/shell/headers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/providers/toast-provider";
import {
  MEMBERSHIP_PLANS,
  PACKAGE_PLANS,
  getBusiness,
  programsForBusiness,
  productsForBusiness,
  reviewsForBusiness,
  servicesForBusiness,
  staffForBusiness,
} from "@/lib/mock";
import type {
  MembershipPlan,
  PackagePlan,
  Staff,
} from "@/lib/mock/types";
import { VERTICAL_META, priceLevelLabel } from "@/lib/taxonomy";
import { formatMoney } from "@/lib/money";
import { fmtDistance } from "@/lib/utils";
import { BuyPlanDrawer, type BuyablePlan } from "./buy-plan-drawer";

export default function BusinessProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const business = getBusiness(id);
  const { toast } = useToast();
  const [plan, setPlan] = React.useState<BuyablePlan | null>(null);

  if (!business) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">We couldn&apos;t find that place</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have moved or is no longer listed.
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
  const services = servicesForBusiness(business.id);
  const products = productsForBusiness(business.id);
  const programs = programsForBusiness(business.id);
  const staff = staffForBusiness(business.id);
  const reviews = reviewsForBusiness(business.id);

  const membershipPlans = MEMBERSHIP_PLANS.filter((p) => p.businessId === business.id);
  const packagePlans = PACKAGE_PLANS.filter((p) => p.businessId === business.id);
  const hasPlans = membershipPlans.length > 0 || packagePlans.length > 0;

  const lowestService = services.reduce<typeof services[number] | undefined>(
    (min, s) => (!min || s.price.minor < min.price.minor ? s : min),
    undefined,
  );
  const bookTarget = services.find((s) => s.popular) ?? lowestService ?? services[0];

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: `Share ${business.name} with a friend`,
      variant: "calm",
    });
  };

  const membershipToPlan = (m: MembershipPlan): BuyablePlan => ({
    id: m.id,
    kind: "membership",
    name: m.name,
    businessName: business.name,
    price: m.price,
    periodLabel: `/ ${m.period}`,
    benefits: m.benefits,
    gradient: m.gradient,
  });

  const packageToPlan = (p: PackagePlan): BuyablePlan => ({
    id: p.id,
    kind: "package",
    name: p.name,
    businessName: business.name,
    price: p.price,
    periodLabel: p.validityLabel,
    benefits: [`${p.sessionsTotal} sessions`, p.scope, p.validityLabel],
    gradient: p.gradient,
  });

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <EntityHeader
        gallery={business.gallery}
        title={business.name}
        subtitle={`${meta.label} · ${business.neighborhood}`}
        meta={
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-white/90">
            <RatingInline
              rating={business.rating}
              count={business.reviewCount}
              className="text-white"
            />
            <span aria-hidden className="text-white/50">
              ·
            </span>
            <span className="text-[0.8125rem] font-semibold">
              {priceLevelLabel(business.priceLevel)}
            </span>
            <Pill tone="neutral" className="bg-white/20 text-white">
              <MapPin className="h-3 w-3" />
              {fmtDistance(business.distanceKm)}
            </Pill>
            {business.openNow && (
              <Pill tone="neutral" className="bg-white/20 text-white">
                Open now
              </Pill>
            )}
          </div>
        }
        actions={
          <>
            <SaveButton businessId={business.id} businessName={business.name} floating />
            <IconButton label="Share" onClick={handleShare} className="bg-card/85">
              <Share2 className="h-[1.15rem] w-[1.15rem]" />
            </IconButton>
          </>
        }
      />

      {/* Content */}
      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* About */}
        <section>
          <SectionHeader title="About" />
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">
            {business.about}
          </p>
          {business.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {business.amenities.map((a) => (
                <Pill key={a} tone="primary">
                  {a}
                </Pill>
              ))}
            </div>
          )}
        </section>

        {/* Save with a membership / package */}
        {hasPlans && (
          <section>
            <SectionHeader
              title="Save with a membership"
              caption="Members pay less and book first"
            />
            <div className="space-y-3">
              {membershipPlans.map((m) => (
                <PlanCard
                  key={m.id}
                  name={m.name}
                  price={m.price}
                  period={m.period}
                  benefits={m.benefits}
                  highlight={m.highlight}
                  ctaLabel="Join now"
                  onChoose={() => setPlan(membershipToPlan(m))}
                />
              ))}
              {packagePlans.map((p) => (
                <article
                  key={p.id}
                  className="flex items-center gap-4 rounded-3xl border bg-card p-4"
                >
                  <MediaImage gradient={p.gradient} className="h-14 w-14 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      {p.sessionsTotal}-session package
                    </p>
                    <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.scope} · {p.validityLabel}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <PriceTag amount={p.price} className="text-sm" />
                    <button
                      type="button"
                      onClick={() => setPlan(packageToPlan(p))}
                      className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
                    >
                      Buy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Services */}
        {services.length > 0 && (
          <section>
            <SectionHeader title="Services" caption={`${services.length} treatments`} />
            <div className="space-y-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </section>
        )}

        {/* Team */}
        {staff.length > 0 && (
          <section>
            <SectionHeader title="Meet the team" />
            <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
              {staff.map((member) => (
                <StaffCard key={member.id} staff={member} serviceId={bookTarget?.id} />
              ))}
            </div>
          </section>
        )}

        {/* Programs */}
        {programs.length > 0 && (
          <section>
            <SectionHeader title="Programs" caption="Guided journeys with a goal" />
            <div className="space-y-3">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {products.length > 0 && (
          <section>
            <SectionHeader title="Shop" caption="Take the ritual home" />
            <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/store/product/${product.id}`}
                  className="block w-36 shrink-0"
                >
                  <MediaImage gradient={product.gradient} className="h-36 w-full rounded-2xl" />
                  <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {product.brand}
                  </p>
                  <h3 className="line-clamp-1 text-sm font-semibold">{product.name}</h3>
                  <PriceTag
                    amount={product.price}
                    compareAt={product.compareAtPrice}
                    className="mt-0.5 text-[0.8125rem]"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section>
            <SectionHeader
              title="Reviews"
              actionLabel={reviews.length > 3 ? "See all" : undefined}
              onAction={() =>
                toast({
                  title: "All reviews",
                  description: `${business.reviewCount} reviews for ${business.name}`,
                  variant: "info",
                })
              }
            />
            <div className="mb-4 flex items-center gap-4 rounded-3xl border bg-card p-4">
              <div className="text-center">
                <p className="font-display text-3xl font-semibold leading-none tabular-nums">
                  {business.rating.toFixed(1)}
                </p>
                <div className="mt-1.5 flex justify-center">
                  <RatingStars rating={business.rating} />
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {business.reviewCount.toLocaleString()} reviews
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Verified visits only
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

        {/* Location & hours */}
        <section>
          <SectionHeader title="Location & hours" />
          <MapView businesses={[business]} className="h-44" />
          <div className="mt-2">
            <InfoRow icon={MapPin} label={business.neighborhood} value={business.address} />
          </div>
          <Accordion type="single" collapsible className="mt-1">
            <AccordionItem value="hours" className="border-t">
              <AccordionTrigger>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Opening hours
                  {business.openNow && (
                    <span className="text-xs font-semibold text-success">· Open now</span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {business.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between text-sm text-foreground/90"
                    >
                      <span className="font-medium">{h.day}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>

      {/* Sticky book CTA */}
      {bookTarget && (
        <FlowFooter
          className="mb-[calc(env(safe-area-inset-bottom)+4.5rem)]"
          primary={
            <Link href={`/service/${bookTarget.id}`} className="block">
              <FooterButton>Book now</FooterButton>
            </Link>
          }
        >
          <div>
            <p className="text-xs text-muted-foreground">from</p>
            <p className="text-base font-semibold tabular-nums">
              {lowestService ? formatMoney(lowestService.price) : formatMoney(bookTarget.price)}
            </p>
          </div>
        </FlowFooter>
      )}

      <BuyPlanDrawer plan={plan} onClose={() => setPlan(null)} />
    </div>
  );
}

/** Tappable team member tile — deep-links into booking the popular service. */
function StaffCard({ staff, serviceId }: { staff: Staff; serviceId?: string }) {
  const inner = (
    <article className="flex w-32 shrink-0 flex-col items-center rounded-3xl border bg-card p-4 text-center transition-transform active:scale-[0.99]">
      <PersonAvatar name={staff.name} gradient={staff.avatarGradient} className="h-16 w-16" />
      <h3 className="mt-2.5 line-clamp-1 text-sm font-semibold">{staff.name}</h3>
      <p className="line-clamp-1 text-xs text-muted-foreground">{staff.role}</p>
      <div className="mt-1.5">
        <RatingInline rating={staff.rating} />
      </div>
    </article>
  );
  return serviceId ? (
    <Link href={`/service/${serviceId}`} aria-label={`Book with ${staff.name}`}>
      {inner}
    </Link>
  ) : (
    inner
  );
}
