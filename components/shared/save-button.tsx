"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { useAppStore } from "@/components/providers/app-store";
import { useToast } from "@/components/providers/toast-provider";
import type { ID } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

export function SaveButton({
  businessId,
  businessName,
  floating = false,
  className,
}: {
  businessId: ID;
  businessName?: string;
  floating?: boolean;
  className?: string;
}) {
  const { isSaved, toggleSaved } = useAppStore();
  const { toast } = useToast();
  const saved = isSaved(businessId);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved" : "Save"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(businessId);
        toast({
          title: saved ? "Removed from saved" : "Saved",
          description: businessName ? `${businessName} ${saved ? "removed" : "added to your places"}` : undefined,
          variant: "calm",
        });
      }}
      className={cn(
        "flex items-center justify-center transition-transform active:scale-90",
        floating
          ? "h-10 w-10 rounded-full bg-card/85 text-foreground shadow-sm backdrop-blur hover:bg-card"
          : "h-9 w-9 rounded-full hover:bg-muted",
        className,
      )}
    >
      <Heart
        className={cn("h-[1.15rem] w-[1.15rem]", saved ? "fill-clay text-clay" : "text-foreground")}
      />
    </button>
  );
}
