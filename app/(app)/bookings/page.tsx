"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientThumb } from "@/components/shared/media-image";
import { EmptyState } from "@/components/shared/states";
import { StackHeader } from "@/components/shell/headers";
import { pastBookings, upcomingBookings } from "@/lib/mock";
import type { Booking } from "@/lib/mock/types";
import { fmtWhen } from "@/lib/datetime";
import { BOOKING_STATUS } from "@/lib/status";

export default function BookingsPage() {
  const upcoming = upcomingBookings();
  const past = pastBookings();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <StackHeader title="Your bookings" backHref="/" />

      <div className="px-5 pb-10 pt-3">
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarClock}
                title="No upcoming bookings"
                description="When you book a treatment, it'll show up here so it's always a tap away."
                actionLabel="Discover wellness"
                onAction={() => {
                  window.location.href = "/discover";
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length > 0 ? (
              <div className="space-y-3">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="No past visits yet"
                description="Your visit history will appear here once you've completed a booking."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const status = BOOKING_STATUS[booking.status];
  return (
    <Link href={`/bookings/${booking.id}`} className="block">
      <article className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]">
        <GradientThumb gradient={booking.gradient} className="h-16 w-16 rounded-2xl">
          <Clock className="h-5 w-5 text-white/90" />
        </GradientThumb>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h3 className="mt-1.5 truncate text-sm font-semibold">{booking.serviceName}</h3>
          <p className="truncate text-xs text-muted-foreground">{booking.businessName}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {fmtWhen(booking.startIso)}
          </p>
          <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground">
            {booking.paidWith.label}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </article>
    </Link>
  );
}
