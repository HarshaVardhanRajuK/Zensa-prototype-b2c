"use client";

import * as React from "react";
import {
  Bell,
  BellOff,
  CalendarClock,
  Gift,
  Layers,
  MessageSquareQuote,
  Sparkles,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { StackHeader } from "@/components/shell/headers";
import { EmptyState } from "@/components/shared/states";
import { GradientThumb } from "@/components/shared/media-image";
import { useAppStore } from "@/components/providers/app-store";
import { NOTIFICATIONS, type NotificationType } from "@/lib/mock";
import { fmtRelative, fmtTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { Gradient } from "@/lib/mock/types";

const META: Record<NotificationType, { icon: LucideIcon; gradient: Gradient }> = {
  reminder: { icon: CalendarClock, gradient: "eucalyptus" },
  program: { icon: Layers, gradient: "forest" },
  membership: { icon: Star, gradient: "sage" },
  offer: { icon: Tag, gradient: "clay" },
  review: { icon: MessageSquareQuote, gradient: "blush" },
  waitlist: { icon: Bell, gradient: "ocean" },
  passport: { icon: Sparkles, gradient: "lavender" },
  loyalty: { icon: Gift, gradient: "amber" },
};

export default function NotificationsPage() {
  const { readIds, markRead, markAllRead, unreadCount } = useAppStore();

  return (
    <div>
      <StackHeader
        title="Notifications"
        actions={
          unreadCount > 0 ? (
            <button onClick={markAllRead} className="text-[0.8125rem] font-semibold text-primary">
              Mark all read
            </button>
          ) : undefined
        }
      />
      {NOTIFICATIONS.length === 0 ? (
        <EmptyState icon={BellOff} title="You're all caught up" description="Reminders and updates will appear here." />
      ) : (
        <div className="px-4 pt-2">
          {NOTIFICATIONS.map((n) => {
            const meta = META[n.type];
            const Icon = meta.icon;
            const unread = !readIds.has(n.id);
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3.5 rounded-3xl p-3.5 text-start transition-colors",
                  unread ? "bg-primary-soft/40" : "hover:bg-muted/50",
                )}
              >
                <GradientThumb gradient={meta.gradient} className="h-11 w-11">
                  <Icon className="h-[1.15rem] w-[1.15rem] text-white" />
                </GradientThumb>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-clay" />}
                  </div>
                  <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {fmtRelative(n.dateIso)} · {fmtTime(n.dateIso)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
