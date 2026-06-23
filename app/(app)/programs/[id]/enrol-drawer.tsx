"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CheckoutSummary } from "@/components/shared/checkout-summary";
import { PaymentSelect } from "@/components/shared/payment-select";
import { FooterButton } from "@/components/shared/flow-footer";
import { useToast } from "@/components/providers/toast-provider";
import { PAYMENT_METHODS } from "@/lib/mock";
import type { Program } from "@/lib/mock/types";

/**
 * Enrolment confirmation sheet for a program.
 * Mock-only: choosing Pay toasts success, closes, and routes to the journey.
 */
export function EnrolDrawer({
  program,
  open,
  onClose,
}: {
  program: Program;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const defaultMethod =
    PAYMENT_METHODS.find((m) => m.isDefault) ?? PAYMENT_METHODS[0];
  const [method, setMethod] = React.useState<string>(defaultMethod?.id ?? "");

  const handleEnrol = () => {
    toast({
      title: "You're enrolled",
      description: `${program.name} · ${program.durationLabel}`,
      variant: "success",
    });
    onClose();
    router.push("/journey");
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold">
            Enrol in this program
          </DrawerTitle>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-5 pb-2">
          <CheckoutSummary
            items={[{ label: program.name, sublabel: program.durationLabel, amount: program.price }]}
            currency={program.price.currency}
          />

          <div>
            <h4 className="mb-2.5 text-sm font-semibold">Pay with</h4>
            <PaymentSelect value={method} onChange={setMethod} />
          </div>

          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Your sessions and milestones appear in your journey straight away.
          </p>
        </div>

        <DrawerFooter>
          <FooterButton onClick={handleEnrol} disabled={!method}>
            Pay &amp; enrol
          </FooterButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
