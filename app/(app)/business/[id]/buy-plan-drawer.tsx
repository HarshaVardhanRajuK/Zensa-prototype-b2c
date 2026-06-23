"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PaymentSelect } from "@/components/shared/payment-select";
import { FooterButton } from "@/components/shared/flow-footer";
import { MediaImage } from "@/components/shared/media-image";
import { useToast } from "@/components/providers/toast-provider";
import { PAYMENT_METHODS } from "@/lib/mock";
import type { Gradient, ID } from "@/lib/mock/types";
import { formatMoney, type Money } from "@/lib/money";

export interface BuyablePlan {
  id: ID;
  kind: "membership" | "package";
  name: string;
  businessName: string;
  price: Money;
  /** "/ month", "Valid 12 months", etc. */
  periodLabel: string;
  benefits: string[];
  gradient: Gradient;
}

/**
 * Lightweight purchase confirmation sheet for memberships & packages.
 * Mock-only: choosing Pay toasts success and closes — no real payment.
 */
export function BuyPlanDrawer({
  plan,
  onClose,
}: {
  plan: BuyablePlan | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const defaultMethod = PAYMENT_METHODS.find((m) => m.isDefault) ?? PAYMENT_METHODS[0];
  const [method, setMethod] = React.useState<string>(defaultMethod?.id ?? "");

  const handlePay = () => {
    if (!plan) return;
    toast({
      title: plan.kind === "membership" ? "Membership active" : "Package purchased",
      description: `${plan.name} · ${plan.businessName}`,
      variant: "success",
    });
    onClose();
  };

  return (
    <Drawer open={plan !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {plan && (
          <>
            <DrawerHeader>
              <DrawerTitle className="text-lg font-semibold">
                {plan.kind === "membership" ? "Join this membership" : "Buy this package"}
              </DrawerTitle>
            </DrawerHeader>

            <div className="space-y-5 overflow-y-auto px-5 pb-2">
              {/* Plan summary */}
              <article className="flex items-center gap-4 rounded-3xl border bg-card p-4">
                <MediaImage gradient={plan.gradient} className="h-14 w-14 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.businessName}</p>
                </div>
                <div className="text-end">
                  <p className="font-semibold tabular-nums">{formatMoney(plan.price)}</p>
                  <p className="text-xs text-muted-foreground">{plan.periodLabel}</p>
                </div>
              </article>

              {/* Benefits */}
              <ul className="space-y-2">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Payment */}
              <div>
                <h4 className="mb-2.5 text-sm font-semibold">Pay with</h4>
                <PaymentSelect value={method} onChange={setMethod} />
              </div>

              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {plan.kind === "membership"
                  ? "Renews automatically. Cancel anytime from your wallet."
                  : "Sessions are added to your wallet straight away."}
              </p>
            </div>

            <DrawerFooter>
              <FooterButton onClick={handlePay} disabled={!method}>
                Pay {formatMoney(plan.price)}
              </FooterButton>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
