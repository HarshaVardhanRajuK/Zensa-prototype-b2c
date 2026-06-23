import Link from "next/link";
import { CalendarPlus, ChevronRight, Compass } from "lucide-react";
import { TabHeader } from "@/components/shell/headers";
import { SectionHeader } from "@/components/shared/primitives";
import { ProgressRing } from "@/components/shared/progress";
import { ProgramCard } from "@/components/shared/program-card";
import { EmptyState } from "@/components/shared/states";
import {
  ACTIVE_PROGRAMS,
  PROGRAMS,
  getBusiness,
  getProgram,
} from "@/lib/mock";
import { fmtWhen } from "@/lib/datetime";

export default function ProgramsPage() {
  const active = ACTIVE_PROGRAMS.filter((ap) => ap.status === "active");

  return (
    <div>
      <TabHeader title="Programs" subtitle="Structured journeys to a goal" />

      <div className="space-y-9 px-5 pb-8 pt-3">
        {/* Your active programs */}
        {active.length > 0 && (
          <section>
            <SectionHeader
              title="Your active programs"
              caption="Pick up where you left off"
            />
            <div className="space-y-3">
              {active.map((ap) => {
                const program = getProgram(ap.programId);
                const business = getBusiness(ap.businessId);
                if (!program) return null;
                const pct = Math.round(
                  (ap.sessionsCompleted / ap.sessionsTotal) * 100,
                );
                return (
                  <Link
                    key={ap.id}
                    href={`/programs/${program.id}`}
                    className="block"
                  >
                    <article className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-transform active:scale-[0.99]">
                      <ProgressRing
                        value={pct}
                        label={`${ap.sessionsCompleted}/${ap.sessionsTotal}`}
                        sublabel="done"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">
                          {program.name}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">
                          {business?.name}
                        </p>
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

        {/* Explore programs */}
        <section>
          <SectionHeader
            title="Explore programs"
            caption="Guided plans with a clear outcome"
          />
          {PROGRAMS.length > 0 ? (
            <div className="space-y-4">
              {PROGRAMS.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No programs yet"
              description="Check back soon — new guided journeys are added regularly."
            />
          )}
        </section>
      </div>
    </div>
  );
}
