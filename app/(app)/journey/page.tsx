"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarPlus,
  ChevronRight,
  Droplets,
  Heart,
  Layers,
  Lock,
  NotebookPen,
  Plus,
  Ruler,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import { Timeline } from "@/components/shared/timeline";
import { ProgressRing, StepTracker, type Step } from "@/components/shared/progress";
import { SectionHeader, Pill } from "@/components/shared/primitives";
import { PersonAvatar } from "@/components/shared/media-image";
import { EmptyState } from "@/components/shared/states";
import { TabHeader } from "@/components/shell/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/components/providers/toast-provider";
import { gradientCss } from "@/lib/media";
import {
  ACTIVE_PROGRAMS,
  BOOKINGS,
  CONSUMER,
  PASSPORT_SHARES,
  TIMELINE,
  WELLNESS_RECORDS,
  getBusiness,
  getProgram,
} from "@/lib/mock";
import type {
  ActiveProgram,
  Milestone,
  PassportShare,
  RecordType,
  WellnessRecord,
} from "@/lib/mock/types";
import { fmtDate, fmtWhen } from "@/lib/datetime";
import { cn, pluralize } from "@/lib/utils";

/* ----------------------------- Page ----------------------------- */

export default function JourneyPage() {
  // Headline stats — the consumer's wellness identity at a glance.
  const totalVisits = BOOKINGS.filter((b) => b.status === "completed").length;
  const activePrograms = ACTIVE_PROGRAMS.filter((p) => p.status === "active");
  const providerIds = new Set<string>();
  for (const t of TIMELINE) if (t.businessId) providerIds.add(t.businessId);
  for (const b of BOOKINGS) providerIds.add(b.businessId);

  return (
    <div>
      <TabHeader title="Your journey" subtitle={`Since ${fmtDate(CONSUMER.memberSinceIso)}`} />

      <div className="px-5 pt-2">
        <PassportCard
          totalVisits={totalVisits}
          activePrograms={activePrograms.length}
          providers={providerIds.size}
        />
      </div>

      <div className="px-5 pt-6">
        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineTab />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsTab programs={activePrograms} />
          </TabsContent>

          <TabsContent value="records">
            <RecordsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* --------------------------- Passport hero --------------------------- */

function PassportCard({
  totalVisits,
  activePrograms,
  providers,
}: {
  totalVisits: number;
  activePrograms: number;
  providers: number;
}) {
  return (
    <article
      className="relative isolate overflow-hidden rounded-[1.75rem] p-5 text-white shadow-card"
      style={{ backgroundImage: gradientCss("clay") }}
    >
      {/* warm sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 90% at 88% 4%, hsl(0 0% 100% / 0.3), transparent 58%)",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/85">
            <Sparkles className="h-3.5 w-3.5" />
            Wellness passport
          </div>
          <Pill tone="neutral" className="bg-white/20 text-white">
            <Award className="h-3 w-3" />
            {CONSUMER.loyaltyTier}
          </Pill>
        </div>

        <div className="mt-5 flex items-center gap-3.5">
          <PersonAvatar
            name={CONSUMER.name}
            gradient={CONSUMER.avatarGradient}
            className="h-14 w-14 ring-2 ring-white/40"
          />
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold leading-tight">{CONSUMER.name}</h2>
            <p className="text-xs text-white/80">Member since {fmtDate(CONSUMER.memberSinceIso)}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
          <Stat value={totalVisits} label={pluralize(totalVisits, "visit")} />
          <Stat value={activePrograms} label={pluralize(activePrograms, "program")} />
          <Stat value={providers} label={pluralize(providers, "provider")} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="me-3 text-xs leading-relaxed text-white/80">
            Your wellness record — carried with you, across every provider.
          </p>
          <Link
            href="/me/passport"
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors active:bg-white/30"
          >
            Manage sharing <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-semibold leading-none tabular-nums">{value}</p>
      <p className="mt-1 text-[0.625rem] uppercase tracking-wide text-white/75">{label}</p>
    </div>
  );
}

/* ----------------------------- Timeline tab ----------------------------- */

function TimelineTab() {
  const achieved = ACTIVE_PROGRAMS.flatMap((ap) => {
    const program = getProgram(ap.programId);
    return ap.milestones
      .filter((m) => m.achieved)
      .map((m) => ({ milestone: m, programName: program?.name ?? "" }));
  });

  return (
    <div className="space-y-7">
      {achieved.length > 0 && (
        <section>
          <SectionHeader title="Milestones" caption="Moments worth celebrating" />
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {achieved.map(({ milestone, programName }) => (
              <article
                key={milestone.id}
                className="w-56 shrink-0 rounded-3xl border border-gold/30 bg-gold/[0.06] p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Award className="h-[1.05rem] w-[1.05rem]" />
                </span>
                <h3 className="mt-3 text-sm font-semibold leading-snug">{milestone.title}</h3>
                {programName && (
                  <p className="mt-0.5 text-xs font-medium text-gold">{programName}</p>
                )}
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {milestone.description}
                </p>
                {milestone.dateIso && (
                  <p className="mt-2 text-[0.6875rem] text-muted-foreground">
                    {fmtDate(milestone.dateIso)}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
          Everything, across every provider, in one place — your wellness story as it unfolds.
        </p>
        {TIMELINE.length > 0 ? (
          <Timeline events={TIMELINE} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Your story starts here"
            description="As you visit providers, book treatments and reach milestones, they'll gather here in one calm timeline."
          />
        )}
      </section>
    </div>
  );
}

/* ----------------------------- Programs tab ----------------------------- */

function ProgramsTab({ programs }: { programs: ActiveProgram[] }) {
  if (programs.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No active programs yet"
        description="Multi-session programs — like a 21-day reset or a strength plan — appear here so you can follow your progress, step by step."
        actionLabel="Explore programs"
        onAction={() => undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      {programs.map((ap) => (
        <ProgramCard key={ap.id} ap={ap} />
      ))}
    </div>
  );
}

function ProgramCard({ ap }: { ap: ActiveProgram }) {
  const program = getProgram(ap.programId);
  const business = getBusiness(ap.businessId);
  if (!program) return null;

  const pct = Math.round((ap.sessionsCompleted / ap.sessionsTotal) * 100);
  const remaining = ap.sessionsTotal - ap.sessionsCompleted;
  const steps = milestonesToSteps(ap.milestones);

  return (
    <Link href={`/programs/${program.id}`} className="block active:scale-[0.99] transition-transform">
      <article className="overflow-hidden rounded-3xl border bg-card p-5">
        <div className="flex items-center gap-4">
          <ProgressRing value={pct} label={`${pct}%`} sublabel="complete" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{program.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{business?.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="primary">{ap.sessionsCompleted} done</Pill>
              <Pill tone="neutral">
                {remaining} {pluralize(remaining, "session")} left
              </Pill>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>

        {ap.nextSessionIso && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            <CalendarPlus className="h-3.5 w-3.5" />
            Next session · {fmtWhen(ap.nextSessionIso)}
          </p>
        )}

        {steps.length > 0 && (
          <div className="mt-5 border-t border-border/60 pt-5">
            <StepTracker steps={steps} />
          </div>
        )}
      </article>
    </Link>
  );
}

function milestonesToSteps(milestones: Milestone[]): Step[] {
  const firstOpen = milestones.findIndex((m) => !m.achieved);
  return milestones.map((m, i) => ({
    title: m.title,
    caption: m.description,
    done: m.achieved,
    current: i === firstOpen,
  }));
}

/* ----------------------------- Records tab ----------------------------- */

const RECORD_META: Record<RecordType, { icon: LucideIcon; label: string }> = {
  allergy: { icon: Heart, label: "Allergies & sensitivities" },
  note: { icon: NotebookPen, label: "Notes" },
  measurement: { icon: Ruler, label: "Measurements" },
  assessment: { icon: ShieldCheck, label: "Assessments" },
  preference: { icon: Droplets, label: "Preferences" },
};

const RECORD_ORDER: RecordType[] = ["allergy", "assessment", "note", "measurement", "preference"];

function RecordsTab() {
  const grouped = RECORD_ORDER.map((type) => ({
    type,
    records: WELLNESS_RECORDS.filter((r) => r.type === type),
  })).filter((g) => g.records.length > 0);

  return (
    <div className="space-y-7">
      {/* Ownership note */}
      <div className="rounded-3xl border border-primary/20 bg-primary-soft/50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Lock className="h-[1.05rem] w-[1.05rem]" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">You own this. You choose who sees it.</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Your records travel with you across providers. Each one is shared only with the
              businesses you allow.
            </p>
            <Link
              href="/me/passport"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              Privacy & sharing <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {grouped.length > 0 ? (
        grouped.map((group) => (
          <RecordGroup key={group.type} type={group.type} records={group.records} />
        ))
      ) : (
        <EmptyState
          icon={NotebookPen}
          title="Your record is empty"
          description="Allergies, preferences and notes you add — or that providers contribute — live here, owned by you."
        />
      )}

      <AddNote />

      <SharedWithSummary shares={PASSPORT_SHARES} />
    </div>
  );
}

function RecordGroup({ type, records }: { type: RecordType; records: WellnessRecord[] }) {
  const { icon: Icon, label } = RECORD_META[type];
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground/70">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-[0.9375rem] font-semibold tracking-tight">{label}</h2>
      </div>
      <div className="space-y-2.5">
        {records.map((r) => (
          <RecordRow key={r.id} record={r} />
        ))}
      </div>
    </section>
  );
}

function RecordRow({ record }: { record: WellnessRecord }) {
  const sharedNames = record.sharedWith
    .map((id) => getBusiness(id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <article className="rounded-3xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug">{record.title}</h3>
          {record.value && (
            <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-foreground/80">
              {record.value}
            </p>
          )}
        </div>
        {record.ownedByConsumer ? (
          <Pill tone="primary" className="shrink-0">
            Self-reported
          </Pill>
        ) : (
          record.source && (
            <Pill tone="neutral" className="shrink-0">
              {record.source}
            </Pill>
          )
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[0.6875rem] text-muted-foreground">{fmtDate(record.dateIso)}</p>
        {sharedNames.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[0.6875rem] text-muted-foreground">Shared with</span>
            <div className="flex -space-x-1.5">
              {sharedNames.slice(0, 3).map((b) => (
                <PersonAvatar
                  key={b.id}
                  name={b.name}
                  gradient={b.gradient}
                  className="h-6 w-6 ring-2 ring-card"
                />
              ))}
            </div>
            {sharedNames.length > 3 && (
              <span className="text-[0.6875rem] font-medium text-muted-foreground">
                +{sharedNames.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function AddNote() {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const handleSave = () => {
    toast({
      title: "Saved to your passport",
      description: "Only you can see this until you choose to share it.",
      variant: "success",
    });
    setText("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-card/50 py-4 text-sm font-semibold text-primary transition-colors active:bg-primary-soft/40"
      >
        <Plus className="h-4 w-4" />
        Add a note
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">Add a note</DrawerTitle>
          </DrawerHeader>
          <div className="px-5 pb-2">
            <p className="mb-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              A preference, a reminder, anything you want to remember. It stays private to you until
              you share it.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              autoFocus
              placeholder="e.g. I prefer unscented oils, and quiet during treatments."
              className="w-full resize-none rounded-2xl border border-input bg-background p-3.5 text-sm leading-relaxed text-start placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <DrawerFooter>
            <Button size="lg" disabled={text.trim().length === 0} onClick={handleSave}>
              Save to passport
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function SharedWithSummary({ shares }: { shares: PassportShare[] }) {
  if (shares.length === 0) return null;
  return (
    <section>
      <SectionHeader
        title="Shared with"
        caption="Who can see parts of your passport"
        actionLabel="Manage"
        actionHref="/me/passport"
      />
      <div className="space-y-2.5">
        {shares.map((s) => {
          const business = getBusiness(s.businessId);
          const revoked = s.status === "revoked";
          return (
            <article
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-3xl border bg-card p-3.5",
                revoked && "opacity-70",
              )}
            >
              {business ? (
                <PersonAvatar name={business.name} gradient={business.gradient} className="h-10 w-10" />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Store className="h-4 w-4" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{s.businessName}</h3>
                <p className="truncate text-xs text-muted-foreground">{s.scope.join(" · ")}</p>
              </div>
              <Badge variant={revoked ? "muted" : "success"} className="shrink-0">
                {revoked ? "Revoked" : "Active"}
              </Badge>
            </article>
          );
        })}
      </div>
    </section>
  );
}
