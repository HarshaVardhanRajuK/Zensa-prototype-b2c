import * as React from "react";
import {
  formatMoney,
  money,
  subtractMoney,
  sumMoney,
  type CurrencyCode,
  type Money,
} from "@/lib/money";
import { cn } from "@/lib/utils";

export interface SummaryLine {
  label: string;
  sublabel?: string;
  amount: Money;
}

export interface SummaryCredit {
  label: string;
  amount: Money; // positive value to subtract
}

/**
 * Reusable order summary used by every checkout (service, product,
 * membership, package, program). Money stays in minor units; the tax row is
 * config-driven (a rate passed in), never hardcoded pricing logic.
 */
export function CheckoutSummary({
  items,
  credits = [],
  currency,
  taxRatePct = 23,
  taxLabel = "VAT",
  className,
}: {
  items: SummaryLine[];
  credits?: SummaryCredit[];
  currency: CurrencyCode;
  taxRatePct?: number;
  taxLabel?: string;
  className?: string;
}) {
  const subtotal = sumMoney(items.map((i) => i.amount), currency);
  const creditTotal = sumMoney(credits.map((c) => c.amount), currency);
  const total = money(Math.max(0, subtotal.minor - creditTotal.minor), currency);
  // Listed prices are tax-inclusive — show the embedded tax for transparency.
  const includedTax = money(
    Math.round((total.minor * taxRatePct) / (100 + taxRatePct)),
    currency,
  );

  return (
    <div className={cn("rounded-3xl border bg-card p-4", className)}>
      <div className="space-y-2.5">
        {items.map((i, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium">{i.label}</p>
              {i.sublabel && <p className="text-xs text-muted-foreground">{i.sublabel}</p>}
            </div>
            <span className="shrink-0 tabular-nums">{formatMoney(i.amount)}</span>
          </div>
        ))}

        {credits.map((c, idx) => (
          <div key={`c-${idx}`} className="flex items-center justify-between gap-3 text-sm text-success">
            <span className="font-medium">{c.label}</span>
            <span className="shrink-0 tabular-nums">−{formatMoney(c.amount)}</span>
          </div>
        ))}
      </div>

      <div className="my-3 border-t border-dashed" />

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="font-display text-xl font-semibold tabular-nums">{formatMoney(total)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Includes {taxLabel} ({taxRatePct}%) · {formatMoney(includedTax)}
      </p>
    </div>
  );
}

/** Helper to total a set of summary lines minus credits. */
export function summaryTotal(
  items: SummaryLine[],
  credits: SummaryCredit[],
  currency: CurrencyCode,
): Money {
  const subtotal = sumMoney(items.map((i) => i.amount), currency);
  const creditTotal = sumMoney(credits.map((c) => c.amount), currency);
  return money(Math.max(0, subtractMoney(subtotal, creditTotal).minor), currency);
}
