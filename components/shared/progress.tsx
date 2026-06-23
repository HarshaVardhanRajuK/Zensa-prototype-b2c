import * as React from "react";
import { Check } from "lucide-react";
import { clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Circular progress ring with a centred label. */
export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  label,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const v = clamp(value);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-sm font-semibold leading-none tabular-nums">{label}</span>}
        {sublabel && <span className="mt-0.5 text-[0.625rem] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

/** Labeled linear progress bar. */
export function ProgressBar({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "clay" | "gold";
}) {
  const fill = tone === "clay" ? "bg-clay" : tone === "gold" ? "bg-gold" : "bg-primary";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-700 ease-out", fill)} style={{ width: `${clamp(value)}%` }} />
    </div>
  );
}

export interface Step {
  title: string;
  caption?: string;
  done: boolean;
  current?: boolean;
}

/** Vertical step tracker for program components & milestones. */
export function StepTracker({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={i} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[0.6875rem] font-bold transition-colors",
                  s.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : s.current
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {!last && <span className={cn("w-px flex-1", s.done ? "bg-primary/40" : "bg-border")} />}
            </div>
            <div className={cn("min-w-0 flex-1", last ? "pb-0" : "pb-5")}>
              <p className={cn("text-sm font-medium leading-snug", !s.done && !s.current && "text-muted-foreground")}>
                {s.title}
              </p>
              {s.caption && <p className="mt-0.5 text-xs text-muted-foreground">{s.caption}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
