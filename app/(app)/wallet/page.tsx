"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Gift,
  Layers,
  Repeat,
  Sparkles,
  Star,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { TabHeader } from "@/components/shell/headers";
import { WalletCard } from "@/components/shared/wallet-card";
import { SectionHeader } from "@/components/shared/primitives";
import { ProgressBar } from "@/components/shared/progress";
import { EmptyState } from "@/components/shared/states";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CONSUMER_MEMBERSHIPS,
  CONSUMER_PACKAGES,
  CONSUMER_SUBSCRIPTIONS,
  GIFT_CARDS,
  STORE_CREDITS,
  LOYALTY,
  getBusiness,
} from "@/lib/mock";
import { HELD_STATUS, SUB_STATUS } from "@/lib/status";
import { formatMoney, sumMoney } from "@/lib/money";
import { fmtDate } from "@/lib/datetime";
import { gradientCss } from "@/lib/media";
import { cn } from "@/lib/utils";
import { HoldingDrawer, type Holding } from "./holding-drawer";

export default function WalletPage() {
  const router = useRouter();
  const [holding, setHolding] = React.useState<Holding | null>(null);

  const giftTotal = sumMoney(
    GIFT_CARDS.map((g) => g.balance),
    "EUR",
  );
  const creditTotal = sumMoney(
    STORE_CREDITS.map((c) => c.balance),
    "EUR",
  );
  const loyaltyPct = LOYALTY.pointsToNextTier
    ? Math.round((LOYALTY.points / (LOYALTY.points + LOYALTY.pointsToNextTier)) * 100)
    : 100;

  return (
    <div>
      <TabHeader title="Wallet" subtitle="Everything you hold" />

      {/* Balance header — the hero of the screen */}
      <section className="px-5 pt-2">
        <div
          className="relative isolate overflow-hidden rounded-3xl p-5 text-white shadow-card"
          style={{ backgroundImage: gradientCss("forest") }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 88% 0%, hsl(0 0% 100% / 0.22), transparent 55%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white/80">
              <Star className="h-3.5 w-3.5" />
              {LOYALTY.tier} member
            </div>

            <div className="mt-2.5 flex items-end justify-between">
              <div>
                <p className="font-display text-4xl font-semibold leading-none tabular-nums">
                  {LOYALTY.points.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-white/75">loyalty points</p>
              </div>
            </div>

            {LOYALTY.nextTier && LOYALTY.pointsToNextTier !== undefined && (
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{ width: `${loyaltyPct}%` }} />
                </div>
                <p className="mt-1.5 text-[0.6875rem] text-white/85">
                  {LOYALTY.pointsToNextTier} points to {LOYALTY.nextTier}
                </p>
              </div>
            )}

            {/* Quick balances */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <BalanceStat
                icon={Gift}
                label="Gift cards"
                value={GIFT_CARDS.length > 0 ? formatMoney(giftTotal) : "—"}
              />
              <BalanceStat
                icon={CreditCard}
                label="Store credit"
                value={STORE_CREDITS.length > 0 ? formatMoney(creditTotal) : "—"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed holdings */}
      <section className="px-5 pt-6">
        <Tabs defaultValue="memberships">
          <div className="no-scrollbar -mx-5 overflow-x-auto px-5">
            <TabsList className="h-auto w-max gap-1 bg-muted/70 p-1">
              <TabsTrigger value="memberships" className="px-3.5 py-1.5">Memberships</TabsTrigger>
              <TabsTrigger value="packages" className="px-3.5 py-1.5">Packages</TabsTrigger>
              <TabsTrigger value="subscriptions" className="px-3.5 py-1.5">Subscriptions</TabsTrigger>
              <TabsTrigger value="cards" className="px-3.5 py-1.5">Cards &amp; credit</TabsTrigger>
              <TabsTrigger value="loyalty" className="px-3.5 py-1.5">Loyalty</TabsTrigger>
            </TabsList>
          </div>

          {/* Memberships */}
          <TabsContent value="memberships">
            {CONSUMER_MEMBERSHIPS.length === 0 ? (
              <WalletEmpty
                icon={Star}
                title="No memberships yet"
                description="Join a studio or spa to unlock member perks and priority booking."
                onDiscover={() => router.push("/discover")}
              />
            ) : (
              <div className="space-y-3.5">
                {CONSUMER_MEMBERSHIPS.map((m) => (
                  <CardButton key={m.id} onSelect={() => setHolding({ kind: "membership", data: m })}>
                    <WalletCard
                      gradient={m.gradient}
                      kind="Membership"
                      icon={Star}
                      title={m.name}
                      subtitle={getBusiness(m.businessId)?.name}
                      statValue={`${formatMoney(m.price)}/${m.period}`}
                      meta={`Renews ${fmtDate(m.renewsIso)}`}
                      status={
                        <Badge variant={HELD_STATUS[m.status].variant}>
                          {HELD_STATUS[m.status].label}
                        </Badge>
                      }
                    />
                  </CardButton>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Packages */}
          <TabsContent value="packages">
            {CONSUMER_PACKAGES.length === 0 ? (
              <WalletEmpty
                icon={Layers}
                title="No packages yet"
                description="Pre-paid session packs are a calmer, better-value way to keep your routine going."
                onDiscover={() => router.push("/discover")}
              />
            ) : (
              <div className="space-y-3.5">
                {CONSUMER_PACKAGES.map((p) => (
                  <CardButton key={p.id} onSelect={() => setHolding({ kind: "package", data: p })}>
                    <WalletCard
                      gradient={p.gradient}
                      kind="Package"
                      icon={Layers}
                      title={p.name}
                      subtitle={getBusiness(p.businessId)?.name}
                      statValue={`${p.sessionsTotal - p.sessionsUsed}`}
                      statLabel="sessions left"
                      meta={`Expires ${fmtDate(p.expiryIso)}`}
                      progress={{ used: p.sessionsUsed, total: p.sessionsTotal }}
                      status={
                        <Badge variant={HELD_STATUS[p.status].variant}>
                          {HELD_STATUS[p.status].label}
                        </Badge>
                      }
                    />
                  </CardButton>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Subscriptions */}
          <TabsContent value="subscriptions">
            {CONSUMER_SUBSCRIPTIONS.length === 0 ? (
              <WalletEmpty
                icon={Repeat}
                title="No subscriptions yet"
                description="Subscribe to a studio for a steady rhythm of classes and sessions each month."
                onDiscover={() => router.push("/discover")}
              />
            ) : (
              <div className="space-y-3.5">
                {CONSUMER_SUBSCRIPTIONS.map((s) => (
                  <CardButton key={s.id} onSelect={() => setHolding({ kind: "subscription", data: s })}>
                    <WalletCard
                      gradient={s.gradient}
                      kind="Subscription"
                      icon={Repeat}
                      title={s.name}
                      subtitle={getBusiness(s.businessId)?.name}
                      statValue={`${formatMoney(s.price)}/${s.period}`}
                      meta={`Renews ${fmtDate(s.renewsIso)}`}
                      status={
                        <Badge variant={SUB_STATUS[s.status].variant}>
                          {SUB_STATUS[s.status].label}
                        </Badge>
                      }
                    />
                  </CardButton>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cards & credit */}
          <TabsContent value="cards">
            {GIFT_CARDS.length === 0 && STORE_CREDITS.length === 0 ? (
              <WalletEmpty
                icon={Gift}
                title="No cards or credit"
                description="Gift cards and store credit you receive will appear here, ready to spend."
                onDiscover={() => router.push("/discover")}
              />
            ) : (
              <div className="space-y-6">
                {GIFT_CARDS.length > 0 && (
                  <div className="space-y-3.5">
                    <SectionHeader title="Gift cards" />
                    {GIFT_CARDS.map((g) => (
                      <article
                        key={g.id}
                        className="relative isolate overflow-hidden rounded-3xl p-5 text-white shadow-card"
                        style={{ backgroundImage: gradientCss(g.gradient) }}
                      >
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage:
                              "radial-gradient(120% 90% at 85% 5%, hsl(0 0% 100% / 0.25), transparent 55%)",
                          }}
                        />
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white/80">
                              <Ticket className="h-3.5 w-3.5" />
                              Gift card
                            </span>
                            <span className="text-xs text-white/80">
                              Expires {fmtDate(g.expiryIso)}
                            </span>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              <p className="font-display text-3xl font-semibold leading-none tabular-nums">
                                {formatMoney(g.balance)}
                              </p>
                              <p className="mt-1 text-xs text-white/75">
                                balance of {formatMoney(g.originalValue)}
                              </p>
                            </div>
                          </div>

                          <p className="mt-4 font-mono text-sm tracking-[0.18em] text-white/90">
                            {g.code}
                          </p>

                          {(g.fromName || g.message) && (
                            <div className="mt-3 rounded-2xl bg-white/15 p-3 backdrop-blur">
                              {g.message && <p className="text-sm leading-snug">{g.message}</p>}
                              {g.fromName && (
                                <p className="mt-1 text-xs text-white/80">— {g.fromName}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {STORE_CREDITS.length > 0 && (
                  <div className="space-y-3">
                    <SectionHeader title="Store credit" />
                    {STORE_CREDITS.map((c) => (
                      <article
                        key={c.id}
                        className="flex items-center gap-4 rounded-3xl border bg-card p-4"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <CreditCard className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold">{c.businessName}</h3>
                          <p className="truncate text-xs text-muted-foreground">{c.reason}</p>
                        </div>
                        <p className="shrink-0 font-display text-lg font-semibold tabular-nums">
                          {formatMoney(c.balance)}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Loyalty */}
          <TabsContent value="loyalty">
            <div className="space-y-6">
              <article className="rounded-3xl border bg-card p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {LOYALTY.tier}
                </p>
                <p className="mt-1 font-display text-5xl font-semibold leading-none tabular-nums">
                  {LOYALTY.points.toLocaleString()}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">points</p>

                {LOYALTY.nextTier && LOYALTY.pointsToNextTier !== undefined && (
                  <div className="mx-auto mt-5 max-w-xs">
                    <ProgressBar value={loyaltyPct} tone="gold" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {LOYALTY.pointsToNextTier}
                      </span>{" "}
                      points to {LOYALTY.nextTier}
                    </p>
                  </div>
                )}
              </article>

              <div>
                <SectionHeader title="Recent activity" />
                {LOYALTY.activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {LOYALTY.activity.map((a, i) => {
                      const positive = a.points >= 0;
                      return (
                        <li key={i} className="flex items-center gap-3 py-3">
                          <span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                              positive ? "bg-success/12 text-success" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {positive ? <Sparkles className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{a.label}</p>
                            <p className="text-xs text-muted-foreground">{fmtDate(a.dateIso)}</p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 text-sm font-semibold tabular-nums",
                              positive ? "text-success" : "text-muted-foreground",
                            )}
                          >
                            {positive ? "+" : ""}
                            {a.points.toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <HoldingDrawer holding={holding} onClose={() => setHolding(null)} />
    </div>
  );
}

function BalanceStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
      <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white/75">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function CardButton({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onSelect} className="block w-full text-start">
      {children}
    </button>
  );
}

function WalletEmpty({
  icon,
  title,
  description,
  onDiscover,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onDiscover: () => void;
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionLabel="Discover wellness"
      onAction={onDiscover}
    />
  );
}
