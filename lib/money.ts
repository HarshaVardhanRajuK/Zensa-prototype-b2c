/**
 * Money — integer minor units + ISO 4217 currency code, always together.
 * Mirrors the platform's NON-NEGOTIABLE money rule (zensa-money-minor-units):
 * no floats, arithmetic stays in minor units, display via Intl.NumberFormat.
 * This is a prototype-faithful subset of the production contract.
 */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "AED";

export interface Money {
  /** Integer amount in the currency's smallest unit (cents, paise, fils). */
  readonly minor: number;
  readonly currency: CurrencyCode;
}

/** Minor-unit exponent per currency (all of ours are 2-decimal). */
const EXPONENT: Record<CurrencyCode, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  INR: 2,
  AED: 2,
};

const LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
  AED: "en-AE",
};

export function money(minor: number, currency: CurrencyCode): Money {
  return { minor: Math.round(minor), currency };
}

/** Build Money from a human major-unit number (prototype seed convenience only). */
export function fromMajor(major: number, currency: CurrencyCode): Money {
  return money(Math.round(major * 10 ** EXPONENT[currency]), currency);
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minor + b.minor, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minor - b.minor, a.currency);
}

export function multiplyMoney(a: Money, factor: number): Money {
  return money(a.minor * factor, a.currency);
}

export function percentOf(a: Money, percent: number): Money {
  return money((a.minor * percent) / 100, a.currency);
}

export function sumMoney(items: Money[], currency: CurrencyCode): Money {
  return items.reduce((acc, m) => addMoney(acc, m), money(0, currency));
}

export function isZero(m: Money): boolean {
  return m.minor === 0;
}

function assertSameCurrency(a: Money, b: Money) {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}

/** Full formatted amount with currency symbol, e.g. "$1,250.00" / "₹4,999.00". */
export function formatMoney(m: Money, opts?: { compact?: boolean }): string {
  const value = m.minor / 10 ** EXPONENT[m.currency];
  return new Intl.NumberFormat(LOCALE[m.currency], {
    style: "currency",
    currency: m.currency,
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.compact ? 1 : EXPONENT[m.currency],
  }).format(value);
}

/** Bare number with grouping, no symbol. */
export function formatMoneyPlain(m: Money): string {
  const value = m.minor / 10 ** EXPONENT[m.currency];
  return new Intl.NumberFormat(LOCALE[m.currency], {
    minimumFractionDigits: EXPONENT[m.currency],
    maximumFractionDigits: EXPONENT[m.currency],
  }).format(value);
}

export function currencySymbol(currency: CurrencyCode): string {
  const parts = new Intl.NumberFormat(LOCALE[currency], {
    style: "currency",
    currency,
  }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value ?? currency;
}
