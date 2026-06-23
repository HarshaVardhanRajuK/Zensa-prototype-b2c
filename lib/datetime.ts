/**
 * Date/time helpers — prototype-faithful to the platform rule:
 * timestamps are conceptually UTC; we render in the location/user locale.
 * For a static prototype we keep ISO strings and format on display.
 */
import {
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";

export function fmtTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function fmtDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy");
}

export function fmtDateLong(iso: string): string {
  return format(parseISO(iso), "EEEE, d MMMM");
}

export function fmtDateShort(iso: string): string {
  return format(parseISO(iso), "d MMM");
}

export function fmtDateTime(iso: string): string {
  return format(parseISO(iso), "d MMM, h:mm a");
}

export function fmtWeekday(iso: string): string {
  return format(parseISO(iso), "EEE");
}

export function fmtWeekdayLong(iso: string): string {
  return format(parseISO(iso), "EEEE");
}

export function fmtDayNum(iso: string): string {
  return format(parseISO(iso), "d");
}

export function fmtMonth(iso: string): string {
  return format(parseISO(iso), "MMM");
}

export function fmtRelative(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return fmtDateShort(iso);
}

/** "Today · 3:00 PM" style label for upcoming things. */
export function fmtWhen(iso: string): string {
  return `${fmtRelative(iso)} · ${fmtTime(iso)}`;
}

export function fmtAgo(iso: string): string {
  return `${formatDistanceToNowStrict(parseISO(iso))} ago`;
}

export function daysUntil(iso: string): number {
  return differenceInCalendarDays(parseISO(iso), new Date());
}

/** Date-range label for stays, e.g. "12–19 Jul 2026". */
export function fmtDateRange(startIso: string, endIso: string): string {
  const s = parseISO(startIso);
  const e = parseISO(endIso);
  const sameMonth = format(s, "MMM yyyy") === format(e, "MMM yyyy");
  if (sameMonth) return `${format(s, "d")}–${format(e, "d MMM yyyy")}`;
  return `${format(s, "d MMM")} – ${format(e, "d MMM yyyy")}`;
}

export function nights(startIso: string, endIso: string): number {
  return differenceInCalendarDays(parseISO(endIso), parseISO(startIso));
}

/** Minutes between two ISO timestamps. */
export function durationMin(startIso: string, endIso: string): number {
  return Math.round(
    (parseISO(endIso).getTime() - parseISO(startIso).getTime()) / 60000,
  );
}

export function fmtDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

/** Greeting based on the prototype "now" (kept simple + deterministic-ish). */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
