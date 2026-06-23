"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarX,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Star,
  Ticket,
  Wallet as WalletIcon,
} from "lucide-react";
import { BookingStepper } from "@/components/shared/booking-stepper";
import {
  CheckoutSummary,
  summaryTotal,
  type SummaryCredit,
  type SummaryLine,
} from "@/components/shared/checkout-summary";
import { PaymentSelect } from "@/components/shared/payment-select";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import {
  InfoRow,
  Pill,
  RatingInline,
  SectionHeader,
} from "@/components/shared/primitives";
import { MediaImage, PersonAvatar } from "@/components/shared/media-image";
import { StackHeader } from "@/components/shell/headers";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/providers/toast-provider";
import {
  PAYMENT_METHODS,
  getBusiness,
  getService,
  membershipsForBusiness,
  packagesForBusiness,
  staffForBusiness,
} from "@/lib/mock";
import type { ConsumerMembership, ConsumerPackage, Staff } from "@/lib/mock/types";
import { fmtDuration } from "@/lib/datetime";
import { formatMoney, money } from "@/lib/money";
import { cn } from "@/lib/utils";

const STEPS = ["Staff", "Time", "Review"] as const;
type Step = 0 | 1 | 2;

/** The prototype "today". */
const TODAY = new Date(2026, 5, 19); // 2026-06-19

interface DayOption {
  iso: string;
  weekday: string;
  dayNum: string;
  month: string;
  isToday: boolean;
}

/** Next ~10 bookable days from the prototype "today". */
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

interface Slot {
  label: string;
  available: boolean;
}

/** Plausible 9:00–18:00 slots; a deterministic few marked unavailable. */
function buildSlots(dayIndex: number): Slot[] {
  const slots: Slot[] = [];
  let idx = 0;
  for (let mins = 9 * 60; mins <= 18 * 60; mins += 45) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const date = new Date(2026, 0, 1, h, m);
    const label = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    // Deterministic "taken" pattern that shifts per day so it feels live.
    const available = (idx + dayIndex * 2) % 5 !== 1 && (idx + dayIndex) % 7 !== 3;
    slots.push({ label, available });
    idx++;
  }
  return slots;
}

export default function BookingFlowPage() {
  const params = useParams<{ serviceId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const serviceId = params.serviceId;
  const service = getService(serviceId);
  const business = service ? getBusiness(service.businessId) : undefined;

  const variationIndex = Number(search.get("variation") ?? "0");

  const [step, setStep] = React.useState<Step>(0);
  const [staffId, setStaffId] = React.useState<string | null>("any");
  const [dayIso, setDayIso] = React.useState<string | null>(null);
  const [slotLabel, setSlotLabel] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState("");
  const defaultMethod = PAYMENT_METHODS.find((m) => m.isDefault) ?? PAYMENT_METHODS[0];
  const [payMethod, setPayMethod] = React.useState<string>(defaultMethod?.id ?? "");
  /** "card" | package id | membership id */
  const [payChoice, setPayChoice] = React.useState<string>("card");

  const days = React.useMemo(buildDays, []);
  const selectedDay = days.find((d) => d.iso === dayIso) ?? null;
  const dayIndex = selectedDay ? days.indexOf(selectedDay) : 0;
  const slots = React.useMemo(() => buildSlots(dayIndex), [dayIndex]);

  if (!service || !business) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <StackHeader title="Book" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">We couldn&apos;t find that service</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              It may have been removed or is no longer offered.
            </p>
          </div>
          <Link href="/discover" className="text-sm font-semibold text-primary">
            Back to discover
          </Link>
        </div>
      </div>
    );
  }

  const variations =
    service.variations.length > 0
      ? service.variations
      : [{ name: "Standard", durationMin: service.durationMin, price: service.price }];
  const safeVarIndex = Math.min(Math.max(0, variationIndex), variations.length - 1);
  const chosen = variations[safeVarIndex];
  const currency = chosen.price.currency;

  const staff = staffForBusiness(business.id);
  const chosenStaff = staffId && staffId !== "any" ? staff.find((s) => s.id === staffId) : undefined;

  // Eligible redemptions: packages with sessions left, and memberships at this business.
  const packages: ConsumerPackage[] = packagesForBusiness(business.id).filter(
    (p) => p.sessionsUsed < p.sessionsTotal,
  );
  const memberships: ConsumerMembership[] = membershipsForBusiness(business.id).filter(
    (m) => m.status === "active" || m.status === "expiring",
  );

  const redeemPackage = packages.find((p) => p.id === payChoice);
  const redeemMembership = memberships.find((m) => m.id === payChoice);
  const isCovered = Boolean(redeemPackage || redeemMembership);

  const summaryItems: SummaryLine[] = [
    {
      label: service.name,
      sublabel: variations.length > 1 ? chosen.name : undefined,
      amount: chosen.price,
    },
  ];
  const credits: SummaryCredit[] = isCovered
    ? [
        {
          label: redeemPackage
            ? `Redeem 1 session · ${redeemPackage.name}`
            : `Included · ${redeemMembership?.name ?? "Membership"}`,
          amount: chosen.price,
        },
      ]
    : [];

  const total = summaryTotal(summaryItems, credits, currency);

  const canAdvance =
    step === 0
      ? staffId !== null
      : step === 1
        ? Boolean(dayIso && slotLabel)
        : payChoice === "card"
          ? Boolean(payMethod)
          : true;

  const handlePrimary = () => {
    if (step < 2) {
      setStep((s) => (s + 1) as Step);
      return;
    }
    toast({
      title: "You're booked",
      description: `${service.name} · ${selectedDay ? `${selectedDay.weekday} ${selectedDay.dayNum} ${selectedDay.month}` : ""}${slotLabel ? ` · ${slotLabel}` : ""}`,
      variant: "success",
    });
    router.push(`/booking/confirmation?service=${serviceId}`);
  };

  const primaryLabel =
    step < 2 ? "Continue" : total.minor === 0 ? "Confirm booking" : `Confirm · ${formatMoney(total)}`;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <StackHeader title="Book" backHref={step === 0 ? undefined : undefined} />

      {/* Stepper */}
      <div className="border-b border-border/60 bg-background/85 px-5 pb-4 pt-1 backdrop-blur-xl">
        <BookingStepper steps={[...STEPS]} current={step} />
      </div>

      {/* Service context strip */}
      <div className="flex items-center gap-3 px-5 pb-1 pt-5">
        <MediaImage gradient={service.gradient} className="h-14 w-14 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{service.name}</h2>
          <p className="truncate text-xs text-muted-foreground">{business.name}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {fmtDuration(chosen.durationMin)}
            {variations.length > 1 && <> · {chosen.name}</>}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-7 px-5 pb-8 pt-6">
        {step === 0 && (
          <section>
            <SectionHeader
              title="Choose your therapist"
              caption="Pick someone you love, or let us match you"
            />
            <div className="space-y-2.5">
              <StaffOption
                selected={staffId === "any"}
                onSelect={() => setStaffId("any")}
                anyAvailable
              />
              {staff.map((member) => (
                <StaffOption
                  key={member.id}
                  staff={member}
                  selected={staffId === member.id}
                  onSelect={() => setStaffId(member.id)}
                />
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <>
            <section>
              <SectionHeader title="Pick a day" />
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
                      <span className="text-lg font-semibold tabular-nums leading-none">
                        {d.dayNum}
                      </span>
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
            </section>

            <section>
              <SectionHeader
                title="Available times"
                caption={
                  selectedDay
                    ? `${selectedDay.isToday ? "Today" : selectedDay.weekday} ${selectedDay.dayNum} ${selectedDay.month}`
                    : "Pick a day to see times"
                }
              />
              {selectedDay ? (
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
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed bg-card/50 px-6 py-10 text-center">
                  <CalendarX className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Choose a day above to see open slots.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {step === 2 && (
          <>
            {/* Booking summary card */}
            <section>
              <article className="overflow-hidden rounded-3xl border bg-card">
                <MediaImage gradient={service.gradient} scrim className="h-28 w-full">
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-lg font-semibold leading-tight text-white">
                      {service.name}
                    </h3>
                    <p className="text-xs text-white/85">{business.name}</p>
                  </div>
                </MediaImage>
                <div className="divide-y px-4">
                  <InfoRow
                    icon={Clock}
                    label={
                      selectedDay
                        ? `${selectedDay.isToday ? "Today" : selectedDay.weekday} ${selectedDay.dayNum} ${selectedDay.month}${slotLabel ? ` · ${slotLabel}` : ""}`
                        : "Date & time"
                    }
                    value={`${fmtDuration(chosen.durationMin)}${variations.length > 1 ? ` · ${chosen.name}` : ""}`}
                  />
                  <InfoRow
                    icon={Star}
                    label={chosenStaff ? chosenStaff.name : "Any available therapist"}
                    value={chosenStaff ? chosenStaff.role : "We'll match you with the best fit"}
                  />
                  <InfoRow icon={MapPin} label={business.neighborhood} value={business.address} />
                </div>
              </article>
            </section>

            {/* Pay with */}
            <section>
              <SectionHeader title="Pay with" />
              <div className="space-y-2.5">
                {packages.map((p) => (
                  <RedeemOption
                    key={p.id}
                    icon={Ticket}
                    selected={payChoice === p.id}
                    onSelect={() => setPayChoice(p.id)}
                    title={`Redeem 1 session · ${p.name}`}
                    sub={`${p.sessionsTotal - p.sessionsUsed} of ${p.sessionsTotal} sessions left`}
                    badge="Free"
                  />
                ))}
                {memberships.map((m) => (
                  <RedeemOption
                    key={m.id}
                    icon={WalletIcon}
                    selected={payChoice === m.id}
                    onSelect={() => setPayChoice(m.id)}
                    title={`Included with ${m.name}`}
                    sub="Covered by your membership"
                    badge="Free"
                  />
                ))}

                <button
                  type="button"
                  onClick={() => setPayChoice("card")}
                  aria-pressed={payChoice === "card"}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors",
                    payChoice === "card"
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-border",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <WalletIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold">Card</span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatMoney(chosen.price)}
                  </span>
                </button>

                {payChoice === "card" && (
                  <div className="ps-1 pt-1">
                    <PaymentSelect value={payMethod} onChange={setPayMethod} />
                  </div>
                )}
              </div>
            </section>

            {/* Order summary */}
            <section>
              <CheckoutSummary items={summaryItems} credits={credits} currency={currency} />
            </section>

            {/* Notes */}
            <section>
              <SectionHeader title="Anything we should know?" caption="Optional — shared with your therapist" />
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Injuries, sensitivities, preferences…"
                rows={3}
              />
            </section>

            {/* Cancellation policy */}
            <div className="flex items-start gap-3 rounded-2xl bg-primary-soft/50 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-foreground/80">
                Free cancellation up to {business.openNow ? "24 hours" : "24 hours"} before your
                appointment. After that, the full amount may be charged.
              </p>
            </div>
          </>
        )}
      </div>

      <FlowFooter
        primary={
          <FooterButton onClick={handlePrimary} disabled={!canAdvance}>
            {primaryLabel}
          </FooterButton>
        }
      >
        <div>
          {step < 2 ? (
            <>
              <p className="text-xs text-muted-foreground">{STEPS[step]} · step {step + 1} of 3</p>
              <p className="text-base font-semibold tabular-nums">{formatMoney(chosen.price)}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">{isCovered ? "Covered" : "Total"}</p>
              <p className="text-base font-semibold tabular-nums">
                {formatMoney(total.minor === 0 ? money(0, currency) : total)}
              </p>
            </>
          )}
        </div>
      </FlowFooter>
    </div>
  );
}

function StaffOption({
  staff,
  selected,
  onSelect,
  anyAvailable = false,
}: {
  staff?: Staff;
  selected: boolean;
  onSelect: () => void;
  anyAvailable?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-3xl border p-4 text-start transition-all active:scale-[0.99]",
        selected ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted",
      )}
    >
      {anyAvailable ? (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
      ) : (
        <PersonAvatar
          name={staff!.name}
          gradient={staff!.avatarGradient}
          className="h-12 w-12"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {anyAvailable ? "Any available" : staff!.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {anyAvailable ? "Soonest slot, best match" : staff!.role}
        </p>
        {!anyAvailable && (
          <div className="mt-1">
            <RatingInline rating={staff!.rating} count={staff!.reviewCount} />
          </div>
        )}
      </div>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-primary text-primary-foreground" : "border-2 border-border",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function RedeemOption({
  icon: Icon,
  title,
  sub,
  badge,
  selected,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  badge?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors",
        selected ? "border-primary ring-1 ring-primary/30" : "border-border",
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      {badge && <Pill tone="success">{badge}</Pill>}
    </button>
  );
}
