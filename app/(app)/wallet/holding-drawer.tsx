"use client";

import * as React from "react";
import Link from "next/link";
import { Check, History, Sparkles } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/shared/media-image";
import { ProgressBar } from "@/components/shared/progress";
import { useToast } from "@/components/providers/toast-provider";
import { getBusiness } from "@/lib/mock";
import type {
  ConsumerMembership,
  ConsumerPackage,
  ConsumerSubscription,
} from "@/lib/mock";
import { HELD_STATUS, SUB_STATUS } from "@/lib/status";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/datetime";

/** The three holding kinds a wallet card can open into. */
export type Holding =
  | { kind: "membership"; data: ConsumerMembership }
  | { kind: "package"; data: ConsumerPackage }
  | { kind: "subscription"; data: ConsumerSubscription };

/** Benefit checklist shared by memberships & subscriptions. */
function BenefitList({ benefits }: { benefits: string[] }) {
  return (
    <ul className="space-y-2.5">
      {benefits.map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-sm">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-foreground/90">{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** Bottom sheet showing full detail + actions for a held membership/package/subscription. */
export function HoldingDrawer({
  holding,
  onClose,
}: {
  holding: Holding | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const business = holding ? getBusiness(holding.data.businessId) : undefined;

  const act = (title: string, description: string) => {
    toast({ title, description, variant: "calm" });
    onClose();
  };

  return (
    <Drawer open={holding !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {holding && (
          <>
            <DrawerHeader>
              <DrawerTitle className="text-lg font-semibold">{holding.data.name}</DrawerTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">{business?.name}</p>
            </DrawerHeader>

            <div className="space-y-6 overflow-y-auto px-5 pb-2">
              {/* Membership */}
              {holding.kind === "membership" && (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Renews</p>
                      <p className="text-sm font-semibold">{fmtDate(holding.data.renewsIso)}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-display text-lg font-semibold tabular-nums">
                        {formatMoney(holding.data.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">/ {holding.data.period}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2.5 text-sm font-semibold">What's included</h4>
                    <BenefitList benefits={holding.data.benefits} />
                  </div>
                </>
              )}

              {/* Package — redemption history */}
              {holding.kind === "package" && (
                <>
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-display text-2xl font-semibold tabular-nums">
                          {holding.data.sessionsTotal - holding.data.sessionsUsed}
                        </p>
                        <p className="text-xs text-muted-foreground">sessions left</p>
                      </div>
                      <p className="pb-1 text-xs text-muted-foreground">
                        Expires {fmtDate(holding.data.expiryIso)}
                      </p>
                    </div>
                    <ProgressBar
                      className="mt-3"
                      value={(holding.data.sessionsUsed / holding.data.sessionsTotal) * 100}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {holding.data.sessionsUsed} of {holding.data.sessionsTotal} used · {holding.data.scope}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Redemption history
                    </h4>
                    {holding.data.redemptions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sessions redeemed yet.</p>
                    ) : (
                      <ul className="divide-y divide-border/60">
                        {holding.data.redemptions.map((r, i) => (
                          <li key={i} className="flex items-center justify-between py-2.5">
                            <span className="text-sm text-foreground/90">{r.serviceName}</span>
                            <span className="text-xs text-muted-foreground">{fmtDate(r.dateIso)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {/* Subscription */}
              {holding.kind === "subscription" && (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Renews</p>
                      <p className="text-sm font-semibold">{fmtDate(holding.data.renewsIso)}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-display text-lg font-semibold tabular-nums">
                        {formatMoney(holding.data.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">/ {holding.data.period}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2.5 text-sm font-semibold">What's included</h4>
                    <BenefitList benefits={holding.data.benefits} />
                  </div>
                </>
              )}

              {/* Status line */}
              <div className="flex items-center gap-2">
                {holding.kind === "subscription" ? (
                  <Badge variant={SUB_STATUS[holding.data.status].variant}>
                    {SUB_STATUS[holding.data.status].label}
                  </Badge>
                ) : (
                  <Badge variant={HELD_STATUS[holding.data.status].variant}>
                    {HELD_STATUS[holding.data.status].label}
                  </Badge>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Held in your wallet
                </span>
              </div>
            </div>

            <DrawerFooter>
              {holding.kind === "membership" && (
                <>
                  <Button
                    size="lg"
                    onClick={() => act("Renewal scheduled", `${holding.data.name} · ${business?.name ?? ""}`)}
                  >
                    Renew membership
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => act("Membership settings", "Manage your plan and benefits.")}
                  >
                    Manage
                  </Button>
                </>
              )}

              {holding.kind === "package" && (
                <Button size="lg" asChild>
                  <Link href={`/business/${holding.data.businessId}`}>Book a session</Link>
                </Button>
              )}

              {holding.kind === "subscription" && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => act("Subscription paused", `${holding.data.name} is paused.`)}
                  >
                    Pause subscription
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => act("Subscription cancelled", `${holding.data.name} will end at the period close.`)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
