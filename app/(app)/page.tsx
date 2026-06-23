import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Repeat,
  Sparkles,
  Wallet as WalletIcon,
} from "lucide-react";
import { MediaImage, PersonAvatar } from "@/components/shared/media-image";
import { SearchBar } from "@/components/shared/search-bar";
import { SectionHeader, Pill } from "@/components/shared/primitives";
import { ProgressRing } from "@/components/shared/progress";
import { BusinessTile } from "@/components/shared/business-card";
import { ServiceTile } from "@/components/shared/service-card";
import { NotificationsBell } from "@/components/shell/headers";
import {
  ACTIVE_PROGRAMS,
  CONSUMER,
  CONSUMER_PACKAGES,
  getBusiness,
  getProgram,
  nearbyBusinesses,
  nextBooking,
  popularServices,
  recentProviders,
} from "@/lib/mock";
import { greeting, fmtWhen, fmtTime, fmtRelative } from "@/lib/datetime";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const booking = nextBooking();
  const programs = ACTIVE_PROGRAMS.filter((p) => p.status === "active");
  const pkg = CONSUMER_PACKAGES.find((p) => p.sessionsUsed < p.sessionsTotal);
  const recents = recentProviders(6);
  const recommended = popularServices(6);
  const nearby = nearbyBusinesses(4);

  return (
    <div>
      {/* Header */}
      <header className="px-5 pb-2 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()},</p>
            <h1 className="font-display text-[1.75rem] font-semibold leading-tight">
              {CONSUMER.firstName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <Link href="/me" aria-label="Profile">
              <PersonAvatar name={CONSUMER.name} gradient={CONSUMER.avatarGradient} className="h-11 w-11" />
            </Link>
          </div>
        </div>
      </header>

      <div className="px-5 pt-2">
        <SearchBar />
      </div>

      {/* Today / Next up hero */}
      {booking && (
        <section className="px-5 pt-5">
          <Link href={`/bookings/${booking.id}`} className="block">
            <MediaImage gradient={booking.gradient} scrim className="rounded-3xl p-5 text-white shadow-card">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Pill tone="neutral" className="bg-white/20 text-white">
                    <Clock className="h-3 w-3" />
                    {fmtRelative(booking.startIso)} · {fmtTime(booking.startIso)}
                  </Pill>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold leading-tight">
                  {booking.serviceName}
                </h2>
                <p className="mt-0.5 text-sm text-white/85">
                  {booking.businessName} · {booking.locationName}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
                    {booking.staffName && <>with {booking.staffName}</>}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </MediaImage>
          </Link>
        </section>
      )}

      {/* Quick actions */}
      <section className="px-5 pt-5">
        <div className="grid grid-cols-4 gap-2.5">
          <QuickAction href="/discover" icon={Compass} label="Discover" />
          <QuickAction href="/bookings" icon={Repeat} label="Rebook" />
          <QuickAction href="/wallet" icon={WalletIcon} label="Wallet" />
          <QuickAction href="/journey" icon={Sparkles} label="Journey" />
        </div>
      </section>

      {/* Continue your journey — active programs */}
      {programs.length > 0 && (
        <section className="px-5 pt-7">
          <SectionHeader title="Continue your journey" actionLabel="Journey" actionHref="/journey" />
          <div className="space-y-3">
            {programs.map((ap) => {
              const program = getProgram(ap.programId);
              const business = getBusiness(ap.businessId);
              if (!program) return null;
              const pct = Math.round((ap.sessionsCompleted / ap.sessionsTotal) * 100);
              return (
                <Link key={ap.id} href={`/programs/${program.id}`} className="block">
                  <article className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]">
                    <ProgressRing value={pct} label={`${ap.sessionsCompleted}/${ap.sessionsTotal}`} sublabel="done" />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{program.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{business?.name}</p>
                      {ap.nextSessionIso && (
                        <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <CalendarPlus className="h-3.5 w-3.5" />
                          Next: {fmtWhen(ap.nextSessionIso)}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Continue package — pick up where you left off */}
      {pkg && (
        <section className="px-5 pt-7">
          <SectionHeader title="Pick up where you left off" />
          {(() => {
            const business = getBusiness(pkg.businessId);
            const remaining = pkg.sessionsTotal - pkg.sessionsUsed;
            return (
              <Link href={business ? `/business/${business.id}` : "/wallet"} className="block">
                <article className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]">
                  <MediaImage gradient={pkg.gradient} className="h-14 w-14 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{business?.name}</p>
                    <h3 className="truncate text-sm font-semibold">{pkg.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{remaining}</span> of {pkg.sessionsTotal} sessions left · {pkg.scope}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground">
                    Book
                  </span>
                </article>
              </Link>
            );
          })()}
        </section>
      )}

      {/* Recent providers */}
      {recents.length > 0 && (
        <section className="pt-7">
          <div className="px-5">
            <SectionHeader title="Your providers" caption="Book again in a tap" />
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {recents.map((b) => (
              <BusinessTile key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended services */}
      {recommended.length > 0 && (
        <section className="pt-7">
          <div className="px-5">
            <SectionHeader title="Recommended for you" caption="Based on your journey" actionLabel="Discover" actionHref="/discover" />
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {recommended.map((s) => (
              <ServiceTile key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {/* Nearby */}
      <section className="px-5 pt-7">
        <SectionHeader title="Near you" caption="Lisbon" actionLabel="Map" actionHref="/discover?view=map" />
        <div className="space-y-3">
          {nearby.map((b) => (
            <CompactNearby key={b.id} businessId={b.id} />
          ))}
        </div>
      </section>

      <div className="px-5 pb-2 pt-8 text-center">
        <Link href="/discover" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Explore all wellness near you <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5">
      <span className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors active:bg-primary-soft/70">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[0.6875rem] font-semibold text-foreground">{label}</span>
    </Link>
  );
}

function CompactNearby({ businessId }: { businessId: string }) {
  const b = getBusiness(businessId);
  if (!b) return null;
  return (
    <Link href={`/business/${b.id}`} className="block">
      <article className="flex items-center gap-3.5 rounded-3xl border bg-card p-3 transition-transform active:scale-[0.99]">
        <MediaImage gradient={b.gradient} className="h-16 w-16 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{b.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{b.tagline}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {b.neighborhood} · {b.distanceKm} km
          </p>
        </div>
        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold text-gold")}>
          ★ {b.rating}
        </span>
      </article>
    </Link>
  );
}
