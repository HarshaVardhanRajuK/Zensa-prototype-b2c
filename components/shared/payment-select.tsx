"use client";

import * as React from "react";
import { CreditCard, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHODS } from "@/lib/mock";
import { cn } from "@/lib/utils";

/** Saved payment method picker, reused across every checkout. */
export function PaymentSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="gap-2.5">
      {PAYMENT_METHODS.map((pm) => (
        <label
          key={pm.id}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border bg-card p-3.5 transition-colors",
            value === pm.id ? "border-primary ring-1 ring-primary/30" : "border-border",
          )}
        >
          <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {pm.brand} ·· {pm.last4}
            </p>
            <p className="text-xs text-muted-foreground">Expires {pm.expiry}</p>
          </div>
          <RadioGroupItem value={pm.id} />
        </label>
      ))}
      <button
        type="button"
        className="flex items-center gap-2 rounded-2xl border border-dashed p-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
        Add payment method
      </button>
    </RadioGroup>
  );
}
