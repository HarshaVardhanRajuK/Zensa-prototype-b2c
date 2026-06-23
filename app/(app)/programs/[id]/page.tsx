"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  CalendarRange,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Dumbbell,
  Layers,
  Package,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import {
  Pill,
  PriceTag,
  SectionHeader,
} from "@/components/shared/primitives";
import { ProgressRing, StepTracker, type Step } from "@/components/shared/progress";
import { MediaImage } from "@/components/shared/media-image";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { StackHeader } from "@/components/shell/headers";
import { Button } from "@/components/ui/button";
import {
  getBusiness,
  getProgram,
  activeProgramByProgramId,
} from "@/lib/mock";
import type { ActiveProgram, ComponentType, Program, ProgramComponent } from "@/lib/mock/types";
import { fmtDuration, fmtWhen } from "@/lib/datetime";
import { EnrolDrawer } from "./enrol-drawer";

const COMPONENT_META: Record<
  ComponentType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  consultation: { label: "Consultation", icon: Stethoscope },
  service: { label: "Treatment", icon: Sparkles },
  class: { label: "Class", icon: Dumbbell },
  assessment: { label: "Assessment", icon: ClipboardCheck },
  product: { label: "Take-home", icon: Package },
};

export default function ProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const program = getProgram(id);
  const business = program ? getBusiness(program.businessId) : undefined;
  const enrolled = activeProgramByProgramId(id);
  const [enrolOpen, setEnrolOpen] = React.useState(false);

  if (!program) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">We couldn&apos;t find that program</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed or is no longer offered.
          </p>
        </div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to programs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero */}
      <div className="relative">
        <MediaImage gradient={program.gradient} scrim className="h-60 w-full">
          <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
            <Pill tone="neutral" icon={Layers} className="bg-white/20 text-white">
              {program.category}
            </Pill>
            <h1 className="mt-2.5 font-display text-2xl font-semibold leading-tight text-white drop-shadow">
              {program.name}
            </h1>
            <p className="mt-1.5 inline-flex items-center gap-2 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="h-3.5 w-3.5" />
                {program.durationLabel}
              </span>
              <span aria-hidden className="text-white/50">·</span>
              <span>{program.sessionsTotal} sessions</span>
            </p>
          </div>
        </MediaImage>

        {/* Floating transparent header */}
        <div className="absolute inset-x-0 top-0">
          <StackHeader transparent backHref="/programs" />
        </div>
      </div>

      {enrolled ? (
        <EnrolledView program={program} businessId={program.businessId} businessName={business?.name} enrolled={enrolled} />
      ) : (
        <MarketingView program={program} businessName={business?.name} onEnrol={() => setEnrolOpen(true)} />
      )}

      <EnrolDrawer program={program} open={enrolOpen} onClose={() => setEnrolOpen(false)} />
    </div>
  );
}

/* ---------- Enrolled (active) view ---------- */

function EnrolledView({
  program,
  businessId,
  businessName,
  enrolled,
}: {
  program: Program;
  businessId: string;
  businessName?: string;
  enrolled: ActiveProgram;
}) {
  const pct = Math.round((enrolled.sessionsCompleted / enrolled.sessionsTotal) * 100);

  // First milestone not yet achieved is the "current" step.
  const firstOpen = enrolled.milestones.findIndex((m) => !m.achieved);
  const steps: Step[] = enrolled.milestones.map((m, i) => ({
    title: m.title,
    caption: m.description,
    done: m.achieved,
    current: i === firstOpen,
  }));

  // Mark the first `sessionsCompleted` components as done.
  const completed: ProgramComponent[] = [];
  const upcoming: ProgramComponent[] = [];
  program.components.forEach((c, i) => {
    if (i < enrolled.sessionsCompleted) completed.push(c);
    else upcoming.push(c);
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* Progress */}
        <section>
          <div className="flex items-center gap-5 rounded-3xl border bg-card p-5">
            <ProgressRing
              value={pct}
              size={92}
              label={`${pct}%`}
              sublabel="complete"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {enrolled.sessionsCompleted} of {enrolled.sessionsTotal} sessions complete
              </p>
              {businessName && (
                <p className="mt-0.5 text-xs text-muted-foreground">at {businessName}</p>
              )}
              {enrolled.nextSessionIso && (
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Next: {fmtWhen(enrolled.nextSessionIso)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <SectionHeader title="Your milestones" caption="How far you've come" />
          <div className="rounded-3xl border bg-card p-5">
            <StepTracker steps={steps} />
          </div>
        </section>

        {/* Upcoming sessions */}
        {upcoming.length > 0 && (
          <section>
            <SectionHeader title="Upcoming sessions" />
            <div className="space-y-2.5">
              {upcoming.map((c, i) => (
                <ComponentRow key={`up-${i}`} component={c} done={false} />
              ))}
            </div>
          </section>
        )}

        {/* Completed sessions */}
        {completed.length > 0 && (
          <section>
            <SectionHeader title="Completed sessions" />
            <div className="space-y-2.5">
              {completed.map((c, i) => (
                <ComponentRow key={`done-${i}`} component={c} done />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA — book next session */}
      <FlowFooter
        primary={
          <Link href={`/business/${businessId}`} className="block">
            <FooterButton>Book next session</FooterButton>
          </Link>
        }
      >
        <div>
          <p className="text-xs text-muted-foreground">Keep going</p>
          <p className="text-sm font-semibold">{pct}% complete</p>
        </div>
      </FlowFooter>
    </div>
  );
}

/* ---------- Marketing (not enrolled) view ---------- */

function MarketingView({
  program,
  businessName,
  onEnrol,
}: {
  program: Program;
  businessName?: string;
  onEnrol: () => void;
}) {
  const business = getBusiness(program.businessId);

  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* Summary */}
        <section>
          <p className="text-[0.9375rem] font-medium leading-relaxed text-foreground">
            {program.summary}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill tone="primary" icon={CalendarRange}>
              {program.durationLabel}
            </Pill>
            <Pill tone="primary" icon={Layers}>
              {program.sessionsTotal} sessions
            </Pill>
          </div>
        </section>

        {/* About */}
        <section>
          <SectionHeader title="About this program" />
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">
            {program.description}
          </p>
        </section>

        {/* What's included */}
        {program.components.length > 0 && (
          <section>
            <SectionHeader title="What's included" caption="Everything in this program" />
            <div className="space-y-2.5">
              {program.components.map((c, i) => (
                <ComponentRow key={i} component={c} />
              ))}
            </div>
          </section>
        )}

        {/* Business mini-card */}
        {business && (
          <section>
            <SectionHeader title="Offered by" />
            <Link
              href={`/business/${business.id}`}
              className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]"
            >
              <MediaImage gradient={business.gradient} className="h-14 w-14 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{business.name}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {business.neighborhood} · {business.tagline}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </section>
        )}
      </div>

      {/* Sticky enrol CTA */}
      <FlowFooter
        primary={
          <FooterButton onClick={onEnrol}>Enrol</FooterButton>
        }
      >
        <div>
          <PriceTag amount={program.price} from className="text-base" />
          {businessName && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{businessName}</p>
          )}
        </div>
      </FlowFooter>
    </div>
  );
}

/* ---------- Shared component row ---------- */

function ComponentRow({
  component,
  done,
}: {
  component: ProgramComponent;
  done?: boolean;
}) {
  const meta = COMPONENT_META[component.type];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border bg-card p-3.5">
      <span
        className={
          done
            ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"
        }
      >
        {done ? <Check className="h-4 w-4" /> : <Icon className="h-[1.15rem] w-[1.15rem]" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className={done ? "truncate text-sm font-medium text-muted-foreground" : "truncate text-sm font-medium"}>
          {component.title}
        </p>
        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{meta.label}</span>
          {component.durationMin !== undefined && (
            <>
              <span aria-hidden className="text-border">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {fmtDuration(component.durationMin)}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
