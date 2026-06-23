"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  CalendarPlus,
  CalendarX,
  Check,
  Clock,
  CreditCard,
  MapPin,
  Navigation,
  Repeat,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { InfoRow, SectionHeader } from "@/components/shared/primitives";
import { MediaImage, PersonAvatar } from "@/components/shared/media-image";
import { FooterButton } from "@/components/shared/flow-footer";
import { StackHeader } from "@/components/shell/headers";
import { useToast } from "@/components/providers/toast-provider";
import { getBooking, getStaff } from "@/lib/mock";
import type { Booking } from "@/lib/mock/types";
import { fmtDateLong, fmtDuration, fmtTime, durationMin } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { BOOKING_STATUS } from "@/lib/status";
import { cn } from "@/lib/utils";

/** The prototype "today". */
const TODAY = new Date(2026, 5, 19);

type DrawerKind = "reschedule" | "cancel" | "review" | null;

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const booking = getBooking(params.id);
  const { toast } = useToast();
  const [drawer, setDrawer] = React.useState<DrawerKind>(null);

  if (!booking) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <StackHeader title="Booking" backHref="/bookings" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <CalendarX className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">We couldn&apos;t find that booking</h1>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed.</p>
          </div>
          <Link href="/bookings" className="text-sm font-semibold text-primary">
            Back to your bookings
          </Link>
        </div>
      </div>
    );
  }

  const staff = booking.staffId ? getStaff(booking.staffId) : undefined;
  const status = BOOKING_STATUS[booking.status];
  const mins = durationMin(booking.startIso, booking.endIso);
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";
  const canManage = booking.status === "upcoming" || booking.status === "confirmed";

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero */}
      <div className="relative">
        <MediaImage gradient={booking.gradient} scrim className="h-52 w-full">
          <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
            <Badge variant={status.variant}>{status.label}</Badge>
            <h1 className="mt-2.5 font-display text-2xl font-semibold leading-tight text-white">
              {booking.serviceName}
            </h1>
            <p className="mt-0.5 text-sm text-white/85">{booking.businessName}</p>
          </div>
        </MediaImage>
        <div className="absolute inset-x-0 top-0">
          <StackHeader transparent backHref="/bookings" />
        </div>
      </div>

      <div className="flex-1 space-y-7 px-5 pb-10 pt-6">
        {/* When & where */}
        <section className="overflow-hidden rounded-3xl border bg-card px-4">
          <div className="divide-y">
            <InfoRow
              icon={Clock}
              label={fmtDateLong(booking.startIso)}
              value={`${fmtTime(booking.startIso)} – ${fmtTime(booking.endIso)} · ${fmtDuration(mins)}`}
            />
            {staff && (
              <div className="flex items-center gap-3 py-3">
                <PersonAvatar name={staff.name} gradient={staff.avatarGradient} className="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.role}</p>
                </div>
              </div>
            )}
            <InfoRow icon={MapPin} label={booking.locationName} value={booking.address} />
            <InfoRow
              icon={CreditCard}
              label={booking.total.minor === 0 ? "No charge" : formatMoney(booking.total)}
              value={booking.paidWith.label}
            />
          </div>
        </section>

        {/* Notes */}
        {booking.notes && (
          <section>
            <SectionHeader title="Your notes" />
            <div className="flex items-start gap-3 rounded-3xl border bg-card p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground/90">{booking.notes}</p>
            </div>
          </section>
        )}

        {/* Manage */}
        <section>
          <SectionHeader title="Manage" />
          <div className="space-y-2.5">
            {canManage && (
              <>
                <ManageRow icon={CalendarClock} label="Reschedule" onClick={() => setDrawer("reschedule")} />
                <ManageRow
                  icon={Navigation}
                  label="Get directions"
                  onClick={() =>
                    toast({
                      title: "Opening directions",
                      description: booking.address,
                      variant: "info",
                    })
                  }
                />
                <ManageRow
                  icon={CalendarPlus}
                  label="Add to calendar"
                  onClick={() =>
                    toast({
                      title: "Added to calendar",
                      description: "We've created a reminder for your appointment.",
                      variant: "calm",
                    })
                  }
                />
                <ManageRow icon={X} label="Cancel booking" tone="danger" onClick={() => setDrawer("cancel")} />
              </>
            )}

            {isCompleted && (
              <>
                <ManageRow icon={Star} label="Leave a review" onClick={() => setDrawer("review")} />
                <Link href={`/service/${booking.serviceId}`} className="block">
                  <ManageRow icon={Repeat} label="Book again" asStatic />
                </Link>
                <ManageRow
                  icon={Navigation}
                  label="Get directions"
                  onClick={() =>
                    toast({
                      title: "Opening directions",
                      description: booking.address,
                      variant: "info",
                    })
                  }
                />
              </>
            )}

            {isCancelled && (
              <Link href={`/service/${booking.serviceId}`} className="block">
                <ManageRow icon={Repeat} label="Book again" asStatic />
              </Link>
            )}
          </div>
        </section>

        {canManage && (
          <p className="text-center text-xs text-muted-foreground">
            Free cancellation up to {booking.cancellationWindowHours} hours before your appointment.
          </p>
        )}
      </div>

      {/* Reschedule */}
      <RescheduleDrawer
        open={drawer === "reschedule"}
        onClose={() => setDrawer(null)}
        booking={booking}
        onConfirm={() => {
          setDrawer(null);
          toast({
            title: "Booking rescheduled",
            description: "We've updated your appointment time.",
            variant: "success",
          });
        }}
      />

      {/* Cancel */}
      <CancelDrawer
        open={drawer === "cancel"}
        onClose={() => setDrawer(null)}
        booking={booking}
        onConfirm={() => {
          setDrawer(null);
          toast({
            title: "Booking cancelled",
            description: `${booking.serviceName} · ${booking.businessName}`,
            variant: "info",
          });
        }}
      />

      {/* Review */}
      <ReviewDrawer
        open={drawer === "review"}
        onClose={() => setDrawer(null)}
        booking={booking}
        onConfirm={() => {
          setDrawer(null);
          toast({
            title: "Thanks for your review",
            description: "Your feedback helps the community.",
            variant: "success",
          });
        }}
      />
    </div>
  );
}

function ManageRow({
  icon: Icon,
  label,
  onClick,
  tone = "default",
  asStatic = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  asStatic?: boolean;
}) {
  const inner = (
    <span
      className={cn(
        "flex w-full items-center gap-3.5 rounded-2xl border bg-card p-4 text-start transition-colors",
        tone === "danger"
          ? "border-destructive/30 text-destructive hover:bg-destructive/5"
          : "border-border hover:bg-muted",
      )}
    >
      <Icon className="h-[1.15rem] w-[1.15rem] shrink-0" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
    </span>
  );
  if (asStatic) return inner;
  return (
    <button type="button" onClick={onClick} className="w-full">
      {inner}
    </button>
  );
}

/* ---------- Date/time picker shared by reschedule ---------- */

interface DayOption {
  iso: string;
  weekday: string;
  dayNum: string;
  month: string;
  isToday: boolean;
}

function buildDays(): DayOption[] {
  const out: DayOption[] = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: String(d.getDate()),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      isToday: i === 0,
    });
  }
  return out;
}

function buildSlots(dayIndex: number): { label: string; available: boolean }[] {
  const slots: { label: string; available: boolean }[] = [];
  let idx = 0;
  for (let mins = 9 * 60; mins <= 18 * 60; mins += 45) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const date = new Date(2026, 0, 1, h, m);
    const label = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const available = (idx + dayIndex * 2) % 5 !== 1 && (idx + dayIndex) % 7 !== 3;
    slots.push({ label, available });
    idx++;
  }
  return slots;
}

function RescheduleDrawer({
  open,
  onClose,
  booking,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirm: () => void;
}) {
  const days = React.useMemo(buildDays, []);
  const [dayIso, setDayIso] = React.useState<string | null>(null);
  const [slotLabel, setSlotLabel] = React.useState<string | null>(null);
  const dayIndex = dayIso ? days.findIndex((d) => d.iso === dayIso) : 0;
  const slots = React.useMemo(() => buildSlots(dayIndex), [dayIndex]);

  // Reset selection each time the sheet opens.
  React.useEffect(() => {
    if (open) {
      setDayIso(null);
      setSlotLabel(null);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[88vh]">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">Reschedule</DrawerTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Currently {fmtDateLong(booking.startIso)} · {fmtTime(booking.startIso)}
          </p>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-5 pb-2 pt-2">
          <div>
            <p className="mb-2.5 text-sm font-semibold">Pick a day</p>
            <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
              {days.map((d) => {
                const active = d.iso === dayIso;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => {
                      setDayIso(d.iso);
                      setSlotLabel(null);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex w-[3.75rem] shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-2 py-3 transition-all active:scale-[0.97]",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.6875rem] font-medium uppercase tracking-wide",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {d.isToday ? "Today" : d.weekday}
                    </span>
                    <span className="text-lg font-semibold tabular-nums leading-none">{d.dayNum}</span>
                    <span
                      className={cn(
                        "text-[0.625rem] font-medium",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {d.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {dayIso && (
            <div>
              <p className="mb-2.5 text-sm font-semibold">Available times</p>
              <div className="grid grid-cols-3 gap-2.5">
                {slots.map((slot) => {
                  const active = slot.label === slotLabel;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSlotLabel(slot.label)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-2xl border py-3 text-sm font-semibold tabular-nums transition-all active:scale-[0.97]",
                        !slot.available
                          ? "cursor-not-allowed border-dashed border-border bg-muted/40 text-muted-foreground/50 line-through"
                          : active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-muted",
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DrawerFooter>
          <FooterButton onClick={onConfirm} disabled={!dayIso || !slotLabel}>
            Confirm new time
          </FooterButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CancelDrawer({
  open,
  onClose,
  booking,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirm: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">Cancel this booking?</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 px-5 pb-2 pt-1">
          <article className="flex items-center gap-3.5 rounded-3xl border bg-card p-4">
            <MediaImage gradient={booking.gradient} className="h-12 w-12 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">{booking.serviceName}</h3>
              <p className="truncate text-xs text-muted-foreground">{booking.businessName}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {fmtDateLong(booking.startIso)} · {fmtTime(booking.startIso)}
              </p>
            </div>
          </article>

          <div className="flex items-start gap-3 rounded-2xl bg-primary-soft/50 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-foreground/80">
              You&apos;re cancelling more than {booking.cancellationWindowHours} hours ahead, so this
              is free. Any payment or session used will be returned to your wallet.
            </p>
          </div>
        </div>

        <DrawerFooter>
          <FooterButton onClick={onConfirm} variant="clay">
            Cancel booking
          </FooterButton>
          <FooterButton onClick={onClose} variant="outline">
            Keep booking
          </FooterButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ReviewDrawer({
  open,
  onClose,
  booking,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  booking: Booking;
  onConfirm: () => void;
}) {
  const [rating, setRating] = React.useState(0);
  const [body, setBody] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setRating(0);
      setBody("");
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">How was your visit?</DrawerTitle>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {booking.serviceName} · {booking.businessName}
          </p>
        </DrawerHeader>

        <div className="space-y-5 px-5 pb-2 pt-2">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className="transition-transform active:scale-90"
              >
                <Star
                  className={cn(
                    "h-9 w-9 transition-colors",
                    n <= rating ? "fill-gold text-gold" : "fill-muted text-muted",
                  )}
                />
              </button>
            ))}
          </div>

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a few words about your experience…"
            rows={4}
          />
        </div>

        <DrawerFooter>
          <FooterButton onClick={onConfirm} disabled={rating === 0}>
            <Check className="h-4 w-4" />
            Submit review
          </FooterButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
