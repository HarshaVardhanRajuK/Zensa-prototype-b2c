"use client";

import * as React from "react";
import {
  Bell,
  CreditCard,
  Heart,
  HelpCircle,
  Info,
  LogOut,
  Monitor,
  Settings2,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { TabHeader } from "@/components/shell/headers";
import { PersonAvatar } from "@/components/shared/media-image";
import { Pill } from "@/components/shared/primitives";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { CONSUMER } from "@/lib/mock";
import { fmtDate } from "@/lib/datetime";
import { SettingsGroup, SettingsLinkRow, SettingsActionRow } from "./settings-ui";

export default function MePage() {
  const { toast } = useToast();

  return (
    <div>
      <TabHeader title="Me" showSearch={false} showBell={false} />

      {/* Profile card */}
      <section className="px-5 pt-1">
        <div className="flex items-center gap-4 rounded-3xl border bg-card p-5 shadow-card">
          <PersonAvatar
            name={CONSUMER.name}
            gradient={CONSUMER.avatarGradient}
            className="h-16 w-16 text-base"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-xl font-semibold leading-tight">
              {CONSUMER.name}
            </h2>
            <p className="truncate text-sm text-muted-foreground">{CONSUMER.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Pill tone="gold" icon={Sparkles}>
                {CONSUMER.loyaltyTier}
              </Pill>
              <span className="text-xs text-muted-foreground">
                Member since {fmtDate(CONSUMER.memberSinceIso)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <SettingsGroup title="Account">
        <SettingsLinkRow
          href="/me/preferences"
          icon={User}
          label="Personal details"
          description="Name, email and phone"
        />
        <SettingsLinkRow
          href="/me/preferences"
          icon={Settings2}
          label="Preferences"
          description="Language, currency, timezone, theme"
        />
        <SettingsLinkRow
          href="/me/payment-methods"
          icon={CreditCard}
          label="Payment methods"
        />
        <SettingsLinkRow href="/me/saved" icon={Heart} label="Saved providers" />
      </SettingsGroup>

      {/* Privacy & data — given prominence */}
      <SettingsGroup
        title="Privacy & data"
        caption="You own your wellness data and control every share."
        prominent
      >
        <SettingsLinkRow
          href="/me/privacy"
          icon={ShieldCheck}
          label="Privacy Center"
          description="Consents and your data rights"
          tone="primary"
        />
        <SettingsLinkRow
          href="/me/passport"
          icon={Sparkles}
          label="Wellness Passport & sharing"
          description="Choose what each provider can see"
          tone="primary"
        />
        <SettingsLinkRow
          href="/me/notifications"
          icon={Bell}
          label="Notification settings"
        />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Security">
        <SettingsLinkRow
          href="/me/devices"
          icon={Monitor}
          label="Devices & sessions"
        />
      </SettingsGroup>

      {/* Support */}
      <SettingsGroup title="Support">
        <SettingsLinkRow href="/me/help" icon={HelpCircle} label="Help & support" />
        <SettingsActionRow
          icon={Info}
          label="About Zensa"
          value="v1.0"
          showChevron={false}
          onClick={() =>
            toast({
              title: "Zensa",
              description: "Your wellness, across every provider. Prototype build.",
              variant: "calm",
            })
          }
        />
      </SettingsGroup>

      {/* Log out */}
      <div className="px-5 pb-2 pt-7">
        <Button
          variant="outline"
          size="pill"
          className="w-full text-destructive hover:text-destructive"
          onClick={() =>
            toast({
              title: "Logged out",
              description: "You've been signed out (prototype — no real session).",
              variant: "info",
            })
          }
        >
          <LogOut className="me-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
