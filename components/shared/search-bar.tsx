"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearch } from "@/components/shell/search-overlay";
import { cn } from "@/lib/utils";

/**
 * A tappable search affordance that opens the global search overlay.
 * Looks like an input but is a button (the overlay owns the real input).
 */
export function SearchBar({
  placeholder = "Search treatments, studios, products…",
  onFilter,
  className,
}: {
  placeholder?: string;
  onFilter?: () => void;
  className?: string;
}) {
  const { open } = useSearch();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={open}
        className="flex h-12 flex-1 items-center gap-2.5 rounded-2xl border border-border/70 bg-card px-4 text-start shadow-sm transition-colors hover:bg-muted"
      >
        <Search className="h-[1.15rem] w-[1.15rem] text-muted-foreground" />
        <span className="truncate text-sm text-muted-foreground">{placeholder}</span>
      </button>
      {onFilter && (
        <button
          type="button"
          onClick={onFilter}
          aria-label="Filters"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          <SlidersHorizontal className="h-[1.15rem] w-[1.15rem]" />
        </button>
      )}
    </div>
  );
}
