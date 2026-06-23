import Link from "next/link";
import { ArrowRight, MapPin, Moon } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { PriceTag, RatingInline, SectionHeader, Pill } from "@/components/shared/primitives";
import { TabHeader } from "@/components/shell/headers";
import { Badge } from "@/components/ui/badge";
import { CONSUMER_STAYS, getStay, residentialStays } from "@/lib/mock";
import { fmtDateRange } from "@/lib/datetime";
import { STAY_STATUS } from "@/lib/status";

export default function StaysPage() {
  const stays = residentialStays();
  const [featured, ...rest] = stays;
  const upcoming = CONSUMER_STAYS[0];
  const upcomingStay = upcoming ? getStay(upcoming.stayId) : undefined;

  return (
    <div>
      <TabHeader title="Retreats" subtitle="Time to come back to yourself" />

      <div className="space-y-9 px-5 pb-10 pt-3">
        {/* Your upcoming stay */}
        {upcoming && upcomingStay && (
          <section>
            <SectionHeader title="Your upcoming stay" />
            <Link href={`/stays/${upcomingStay.id}`} className="block">
              <article className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]">
                <MediaImage gradient={upcomingStay.gradient} className="h-16 w-16 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={STAY_STATUS[upcoming.status].variant}>
                      {STAY_STATUS[upcoming.status].label}
                    </Badge>
                  </div>
                  <h3 className="truncate text-sm font-semibold">{upcomingStay.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {fmtDateRange(upcoming.checkInIso, upcoming.checkOutIso)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </article>
            </Link>
          </section>
        )}

        {/* Featured hero */}
        {featured && (
          <section>
            <Link href={`/stays/${featured.id}`} className="block">
              <MediaImage
                gradient={featured.gradient}
                scrim
                className="aspect-[4/5] w-full rounded-3xl text-white shadow-card"
              >
                <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
                  <Pill tone="neutral" className="bg-white/20 text-white">
                    <Moon className="h-3 w-3" />
                    {featured.nights} nights
                  </Pill>
                  <h2 className="mt-3 font-display text-2xl font-semibold leading-tight drop-shadow-sm">
                    {featured.name}
                  </h2>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/85">
                    <MapPin className="h-3.5 w-3.5" />
                    {featured.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <RatingInline
                      rating={featured.rating}
                      count={featured.reviewCount}
                      className="text-white"
                    />
                    <PriceTag amount={featured.fromPrice} from className="text-white" />
                  </div>
                </div>
              </MediaImage>
            </Link>
          </section>
        )}

        {/* All retreats */}
        {rest.length > 0 && (
          <section>
            <SectionHeader title="More retreats" caption="Multi-day journeys to restore" />
            <div className="space-y-3">
              {rest.map((stay) => (
                <Link key={stay.id} href={`/stays/${stay.id}`} className="block">
                  <article className="overflow-hidden rounded-3xl border bg-card transition-transform active:scale-[0.99]">
                    <MediaImage gradient={stay.gallery[0]} className="h-40 w-full" />
                    <div className="p-4">
                      <h3 className="text-sm font-semibold">{stay.name}</h3>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {stay.location}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <RatingInline rating={stay.rating} count={stay.reviewCount} />
                          <span aria-hidden className="text-border">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Moon className="h-3 w-3" />
                            {stay.nights} nights
                          </span>
                        </div>
                        <PriceTag amount={stay.fromPrice} from className="text-sm" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
