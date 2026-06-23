"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { addDays, format, parseISO } from "date-fns";
import {
  CalendarDays,
  Check,
  Minus,
  Moon,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BookingStepper } from "@/components/shared/booking-stepper";
import { CheckoutSummary, type SummaryLine } from "@/components/shared/checkout-summary";
import { PaymentSelect } from "@/components/shared/payment-select";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { PriceTag, SectionHeader } from "@/components/shared/primitives";
import { StackHeader } from "@/components/shell/headers";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/providers/toast-provider";
import { getStay } from "@/lib/mock";
import { fmtDateRange } from "@/lib/datetime";
import { multiplyMoney } from "@/lib/money";
import { PAYMENT_METHODS } from "@/lib/mock";
import { cn } from "@/lib/utils";

const STEPS = ["Dates", "Room", "Review"];
/** Preset arrival dates the prototype offers (ISO date-only). */
const ARRIVAL_DATES = ["2026-07-15", "2026-07-29", "2026-08-12", "2026-08-26"];

export default function StayBookingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const stay = getStay(params.id);

  const [step, setStep] = React.useState(0);
  const [arrival, setArrival] = React.useState(ARRIVAL_DATES[0]);
  const [nights, setNights] = React.useState(stay?.nights ?? 1);
  const [roomIndex, setRoomIndex] = React.useState(0);
  const [guests, setGuests] = React.useState(1);
  const [paymentId, setPaymentId] = React.useState(
    PAYMENT_METHODS.find((p) => p.isDefault)?.id ?? PAYMENT_METHODS[0]?.id ?? "",
  );

  if (!stay) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-8 text-center">
        <Moon className="h-7 w-7 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Retreat not found</h1>
      </div>
    );
  }

  const room = stay.roomTypes[Math.min(roomIndex, stay.roomTypes.length - 1)];
  const checkOutIso = format(addDays(parseISO(arrival), nights), "yyyy-MM-dd");
  const stayCost = multiplyMoney(room.pricePerNight, nights);
  const currency = room.pricePerNight.currency;

  const summaryItems: SummaryLine[] = [
    {
      label: `${room.name} × ${nights} ${nights === 1 ? "night" : "nights"}`,
      sublabel: fmtDateRange(arrival, checkOutIso),
      amount: stayCost,
    },
    {
      label: "Wellness programme",
      sublabel: "Daily classes, treatments & full board",
      amount: multiplyMoney(room.pricePerNight, 0),
    },
  ];

  const back = () => (step === 0 ? router.back() : setStep((s) => s - 1));

  const handleConfirm = () => {
    toast({
      title: "Reservation confirmed",
      description: `${stay.name} · ${fmtDateRange(arrival, checkOutIso)}`,
      variant: "success",
    });
    router.push(`/stays/${stay.id}`);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <StackHeader title={stay.name} backHref={step === 0 ? `/stays/${stay.id}` : undefined} />
      <div className="px-5 pb-2 pt-1">
        <BookingStepper steps={STEPS} current={step} />
      </div>

      <div className="flex-1 space-y-7 px-5 pb-8 pt-5">
        {/* Step 1 — Dates */}
        {step === 0 && (
          <>
            <section>
              <SectionHeader title="Choose your arrival" caption="Pick a start date" />
              <div className="grid grid-cols-2 gap-2.5">
                {ARRIVAL_DATES.map((d) => {
                  const active = d === arrival;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setArrival(d)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border p-3.5 text-start transition-all",
                        active
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-card active:scale-[0.99] hover:bg-muted",
                      )}
                    >
                      <CalendarDays
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="text-sm font-semibold">{format(parseISO(d), "d MMM")}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <SectionHeader title="Nights" />
              <Stepper
                icon={Moon}
                label={`${nights} ${nights === 1 ? "night" : "nights"}`}
                onDec={() => setNights((n) => Math.max(1, n - 1))}
                onInc={() => setNights((n) => Math.min(21, n + 1))}
                decDisabled={nights <= 1}
                incDisabled={nights >= 21}
              />
            </section>

            <div className="rounded-3xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">Your stay</p>
              <p className="mt-0.5 text-sm font-semibold">{fmtDateRange(arrival, checkOutIso)}</p>
            </div>
          </>
        )}

        {/* Step 2 — Room */}
        {step === 1 && (
          <>
            <section>
              <SectionHeader title="Choose a room" caption="Per-night rate" />
              <RadioGroup
                value={String(roomIndex)}
                onValueChange={(v) => setRoomIndex(Number(v))}
                className="gap-2.5"
              >
                {stay.roomTypes.map((r, i) => {
                  const active = i === roomIndex;
                  return (
                    <label
                      key={r.name}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 transition-colors",
                        active ? "border-primary ring-1 ring-primary/30" : "border-border",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                          {r.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2.5">
                          <PriceTag amount={r.pricePerNight} suffix="/night" className="text-sm" />
                          <span aria-hidden className="text-border">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            Sleeps {r.capacity}
                          </span>
                        </div>
                      </div>
                      <RadioGroupItem value={String(i)} className="mt-1" />
                    </label>
                  );
                })}
              </RadioGroup>
            </section>

            <section>
              <SectionHeader title="Guests" />
              <Stepper
                icon={Users}
                label={`${guests} ${guests === 1 ? "guest" : "guests"}`}
                onDec={() => setGuests((g) => Math.max(1, g - 1))}
                onInc={() => setGuests((g) => Math.min(2, g + 1))}
                decDisabled={guests <= 1}
                incDisabled={guests >= 2}
              />
            </section>
          </>
        )}

        {/* Step 3 — Review */}
        {step === 2 && (
          <>
            <section>
              <SectionHeader title="Review your stay" />
              <div className="rounded-3xl border bg-card p-4">
                <h3 className="text-sm font-semibold">{stay.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{stay.location}</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <Row label="Dates" value={fmtDateRange(arrival, checkOutIso)} />
                  <Row label="Room" value={room.name} />
                  <Row label="Guests" value={`${guests} ${guests === 1 ? "guest" : "guests"}`} />
                </div>
              </div>
            </section>

            <section>
              <CheckoutSummary items={summaryItems} currency={currency} />
            </section>

            <section>
              <SectionHeader title="Payment" />
              <PaymentSelect value={paymentId} onChange={setPaymentId} />
            </section>

            <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs leading-snug text-foreground/80">
                A 20% deposit secures your place. The balance is due 30 days before arrival, with
                free cancellation up to then.
              </p>
            </div>
          </>
        )}
      </div>

      <FlowFooter
        primary={
          step < 2 ? (
            <FooterButton onClick={() => setStep((s) => s + 1)}>Continue</FooterButton>
          ) : (
            <FooterButton onClick={handleConfirm}>Confirm reservation</FooterButton>
          )
        }
      >
        {step === 2 ? (
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <PriceTag amount={stayCost} className="text-base" />
          </div>
        ) : (
          <button
            type="button"
            onClick={back}
            className="text-sm font-semibold text-muted-foreground"
          >
            Back
          </button>
        )}
      </FlowFooter>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Stepper({
  icon: Icon,
  label,
  onDec,
  onInc,
  decDisabled,
  incDisabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onDec: () => void;
  onInc: () => void;
  decDisabled?: boolean;
  incDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-card p-3.5">
      <span className="inline-flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <div className="flex items-center gap-2">
        <StepButton onClick={onDec} disabled={decDisabled} aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </StepButton>
        <StepButton onClick={onInc} disabled={incDisabled} aria-label="Increase">
          <Plus className="h-4 w-4" />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-40"
      {...rest}
    >
      {children}
    </button>
  );
}
