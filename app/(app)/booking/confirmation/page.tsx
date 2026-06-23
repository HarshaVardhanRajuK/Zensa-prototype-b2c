"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarPlus, Check, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { MediaImage } from "@/components/shared/media-image";
import { useToast } from "@/components/providers/toast-provider";
import { getBusiness, getService } from "@/lib/mock";
import { cn } from "@/lib/utils";

function ConfirmationContent() {
  const search = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const serviceId = search.get("service");
  const service = serviceId ? getService(serviceId) : undefined;
  const business = service ? getBusiness(service.businessId) : undefined;

  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-10 text-center">
        {/* Success mark */}
        <div className="relative flex items-center justify-center">
          <span
            className={cn(
              "absolute inline-flex h-28 w-28 rounded-full bg-primary-soft transition-all duration-700 ease-out",
              shown ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
          <span
            className={cn(
              "relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float transition-all duration-500 ease-out",
              shown ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <Check className="h-9 w-9" strokeWidth={3} />
          </span>
        </div>

        <h1
          className={cn(
            "mt-7 font-display text-2xl font-semibold transition-all duration-500 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          You&apos;re booked
        </h1>
        <p
          className={cn(
            "mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground transition-all delay-100 duration-500 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {service
            ? `Your ${service.name} is confirmed. We've sent the details to your inbox.`
            : "Your appointment is confirmed. We've sent the details to your inbox."}
        </p>

        {/* Summary card */}
        {service && business && (
          <article
            className={cn(
              "mt-7 w-full overflow-hidden rounded-3xl border bg-card text-start transition-all delay-150 duration-500 ease-out",
              shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <div className="flex items-center gap-3.5 p-4">
              <MediaImage gradient={service.gradient} className="h-14 w-14 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">{service.name}</h2>
                <p className="truncate text-xs text-muted-foreground">{business.name}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {business.neighborhood}
                </p>
              </div>
            </div>
          </article>
        )}

        {/* Added to journey */}
        <Link
          href="/journey"
          className={cn(
            "mt-3 flex w-full items-center gap-3 rounded-3xl border border-primary/30 bg-primary-soft/50 p-4 text-start transition-all delay-200 duration-500 ease-out active:scale-[0.99]",
            shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Added to your Journey</p>
            <p className="text-xs text-muted-foreground">
              We&apos;ll track this visit in your wellness timeline.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
        </Link>

        {/* Add to calendar */}
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Added to calendar",
              description: "We've created a reminder for your appointment.",
              variant: "calm",
            })
          }
          className={cn(
            "mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all delay-300 duration-500 ease-out",
            shown ? "opacity-100" : "opacity-0",
          )}
        >
          <CalendarPlus className="h-4 w-4" />
          Add to calendar
        </button>
      </div>

      <FlowFooter
        primary={
          <Link href="/" className="block">
            <FooterButton>Done</FooterButton>
          </Link>
        }
      >
        <Link href="/bookings" className="block">
          <FooterButton variant="outline">View booking</FooterButton>
        </Link>
      </FlowFooter>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
      <ConfirmationContent />
    </React.Suspense>
  );
}
