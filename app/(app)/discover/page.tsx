"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Map as MapIcon, Rows3, SearchX, Sparkles } from "lucide-react";
import { TabHeader } from "@/components/shell/headers";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryChip, ChoiceChip } from "@/components/shared/chips";
import { SectionHeader } from "@/components/shared/primitives";
import { BusinessCard } from "@/components/shared/business-card";
import { MediaImage } from "@/components/shared/media-image";
import { MapView, MapPinCard } from "@/components/shared/map-view";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/providers/toast-provider";
import {
  BUSINESSES,
  CATEGORIES,
  COLLECTIONS,
  collectionBusinesses,
} from "@/lib/mock";
import type { Business, Vertical } from "@/lib/mock";
import { VERTICAL_META, priceLevelLabel } from "@/lib/taxonomy";
import { fmtDistance } from "@/lib/utils";

type SortKey = "recommended" | "nearest" | "rating" | "price";
type PriceLevel = 1 | 2 | 3;
type ViewMode = "list" | "map";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "nearest", label: "Nearest" },
  { key: "rating", label: "Top rated" },
  { key: "price", label: "Price" },
];

const PRICE_LEVELS: PriceLevel[] = [1, 2, 3];
const MAX_DISTANCE = 10;

interface Filters {
  sort: SortKey;
  prices: PriceLevel[];
  openNow: boolean;
  distance: number;
}

const DEFAULT_FILTERS: Filters = {
  sort: "recommended",
  prices: [],
  openNow: false,
  distance: MAX_DISTANCE,
};

const VERTICALS = new Set<string>(CATEGORIES.map((c) => c.vertical));

function isVertical(value: string | null): value is Vertical {
  return value !== null && VERTICALS.has(value);
}

/** A recommendation blend — verified & top-rated float up, residential last. */
function recommendedScore(b: Business): number {
  return b.rating * 2 + (b.verified ? 1 : 0) - (b.distanceKm === 0 ? 5 : 0);
}

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const initialCategory = searchParams.get("category");
  const initialView = searchParams.get("view");

  const [category, setCategory] = React.useState<Vertical | null>(
    isVertical(initialCategory) ? initialCategory : null,
  );
  const [collectionId, setCollectionId] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ViewMode>(
    initialView === "map" ? "map" : "list",
  );

  // Applied filters (drive results) vs. draft filters (edited inside the sheet).
  const [filters, setFilters] = React.useState<Filters>(DEFAULT_FILTERS);
  const [draft, setDraft] = React.useState<Filters>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const activeCollection = collectionId
    ? COLLECTIONS.find((c) => c.id === collectionId)
    : undefined;

  const results = React.useMemo(() => {
    const base = collectionId ? collectionBusinesses(collectionId) : BUSINESSES;

    const filtered = base.filter((b) => {
      if (category && b.vertical !== category) return false;
      if (filters.openNow && !b.openNow) return false;
      if (filters.prices.length > 0 && !filters.prices.includes(b.priceLevel)) {
        return false;
      }
      // Residential (distanceKm === 0) are destinations, not distance-bound —
      // keep them unless the user has dialled distance below the max.
      if (b.distanceKm > 0 && b.distanceKm > filters.distance) return false;
      if (b.distanceKm === 0 && filters.distance < MAX_DISTANCE) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case "nearest": {
          // Destinations have no proximity — sort them to the end gracefully.
          const da = a.distanceKm === 0 ? Infinity : a.distanceKm;
          const db = b.distanceKm === 0 ? Infinity : b.distanceKm;
          return da - db;
        }
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.priceLevel - b.priceLevel;
        case "recommended":
        default:
          return recommendedScore(b) - recommendedScore(a);
      }
    });

    return sorted;
  }, [category, collectionId, filters]);

  // Keep the map selection valid as results change.
  React.useEffect(() => {
    if (results.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((prev) =>
      prev && results.some((b) => b.id === prev) ? prev : results[0].id,
    );
  }, [results]);

  const activeFilterCount =
    (filters.sort !== "recommended" ? 1 : 0) +
    (filters.prices.length > 0 ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    (filters.distance < MAX_DISTANCE ? 1 : 0);

  function syncUrl(next: { category?: Vertical | null; view?: ViewMode }) {
    const params = new URLSearchParams(searchParams.toString());
    if ("category" in next) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }
    if ("view" in next && next.view) {
      if (next.view === "map") params.set("view", "map");
      else params.delete("view");
    }
    const qs = params.toString();
    router.replace(qs ? `/discover?${qs}` : "/discover", { scroll: false });
  }

  function toggleCategory(v: Vertical) {
    const next = category === v ? null : v;
    setCategory(next);
    setCollectionId(null);
    syncUrl({ category: next });
  }

  function pickCollection(id: string) {
    const next = collectionId === id ? null : id;
    setCollectionId(next);
    if (next) {
      setCategory(null);
      syncUrl({ category: null });
    }
  }

  function changeView(next: ViewMode) {
    setView(next);
    syncUrl({ view: next });
  }

  function openFilters() {
    setDraft(filters);
    setFilterOpen(true);
  }

  function applyFilters() {
    setFilters(draft);
    setFilterOpen(false);
    toast({ title: "Filters applied", variant: "calm" });
  }

  function clearAll() {
    setFilters(DEFAULT_FILTERS);
    setDraft(DEFAULT_FILTERS);
    setCategory(null);
    setCollectionId(null);
    syncUrl({ category: null });
  }

  const selectedBusiness = results.find((b) => b.id === selectedId);

  return (
    <div>
      <TabHeader title="Discover" subtitle="Lisbon · within 10 km" />

      <div className="px-5 pt-1">
        <SearchBar onFilter={openFilters} />
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={openFilters}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground"
          >
            <span className="font-semibold text-primary">{activeFilterCount}</span>
            filter{activeFilterCount > 1 ? "s" : ""} active · edit
          </button>
        )}
      </div>

      {/* Category rail */}
      <section className="pt-5">
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {CATEGORIES.map((c) => {
            const meta = VERTICAL_META[c.vertical];
            const active = category === c.vertical;
            return (
              <span
                key={c.id}
                className="transition-opacity"
                style={{ opacity: category && !active ? 0.55 : 1 }}
              >
                <CategoryChip
                  label={c.label}
                  icon={meta.icon}
                  gradient={c.gradient}
                  onClick={() => toggleCategory(c.vertical)}
                />
              </span>
            );
          })}
        </div>
      </section>

      {/* Collections */}
      <section className="pt-6">
        <div className="px-5">
          <SectionHeader
            title="Collections"
            caption="Hand-picked places for a feeling"
          />
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {COLLECTIONS.map((col) => {
            const active = collectionId === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => pickCollection(col.id)}
                className="block w-60 shrink-0 text-start"
                aria-pressed={active}
              >
                <MediaImage
                  gradient={col.gradient}
                  scrim
                  className="h-36 w-full rounded-3xl p-4 text-white shadow-card transition-transform active:scale-[0.99]"
                >
                  <div className="relative flex h-full flex-col justify-end">
                    {active && (
                      <span className="absolute end-0 top-0 inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-[0.625rem] font-semibold backdrop-blur">
                        <Check className="h-3 w-3" />
                        Showing
                      </span>
                    )}
                    <Sparkles className="h-4 w-4 text-white/80" />
                    <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight">
                      {col.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/85">
                      {col.subtitle}
                    </p>
                  </div>
                </MediaImage>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results header + view toggle */}
      <section className="px-5 pt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.0625rem] font-semibold tracking-tight">
              {activeCollection ? activeCollection.title : "Places near you"}
            </h2>
            <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
              {results.length} {results.length === 1 ? "place" : "places"}
              {category ? ` · ${VERTICAL_META[category].label}` : ""}
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => {
              if (v === "list" || v === "map") changeView(v);
            }}
            className="shrink-0"
            aria-label="View mode"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <Rows3 className="h-3.5 w-3.5" />
              List
            </ToggleGroupItem>
            <ToggleGroupItem value="map" aria-label="Map view">
              <MapIcon className="h-3.5 w-3.5" />
              Map
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nothing matches yet"
            description="Try widening your distance or clearing a filter to see more places."
            actionLabel="Clear filters"
            onAction={clearAll}
          />
        ) : view === "map" ? (
          <div className="relative">
            <MapView
              businesses={results}
              selectedId={selectedId ?? undefined}
              onSelect={setSelectedId}
              className="h-[60vh] w-full"
            />
            {selectedBusiness && (
              <div className="absolute inset-x-3 bottom-3">
                <MapPinCard business={selectedBusiness} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </section>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        draft={draft}
        setDraft={setDraft}
        onApply={applyFilters}
        onReset={() => setDraft(DEFAULT_FILTERS)}
      />
    </div>
  );
}

/* ---------- Filter sheet (local) ---------- */

function FilterDrawer({
  open,
  onOpenChange,
  draft,
  setDraft,
  onApply,
  onReset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Filters;
  setDraft: React.Dispatch<React.SetStateAction<Filters>>;
  onApply: () => void;
  onReset: () => void;
}) {
  function togglePrice(level: PriceLevel) {
    setDraft((d) => ({
      ...d,
      prices: d.prices.includes(level)
        ? d.prices.filter((p) => p !== level)
        : [...d.prices, level],
    }));
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-lg font-semibold">
            Sort &amp; filter
          </DrawerTitle>
          <button
            type="button"
            onClick={onReset}
            className="text-[0.8125rem] font-semibold text-primary"
          >
            Reset
          </button>
        </DrawerHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-3">
          {/* Sort */}
          <div>
            <p className="mb-2.5 text-sm font-semibold">Sort by</p>
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <ChoiceChip
                  key={s.key}
                  selected={draft.sort === s.key}
                  onClick={() => setDraft((d) => ({ ...d, sort: s.key }))}
                >
                  {s.label}
                </ChoiceChip>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="mb-2.5 text-sm font-semibold">Price</p>
            <div className="space-y-1">
              {PRICE_LEVELS.map((level) => {
                const id = `price-${level}`;
                return (
                  <label
                    key={level}
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl px-1 py-2.5"
                  >
                    <Checkbox
                      id={id}
                      checked={draft.prices.includes(level)}
                      onCheckedChange={() => togglePrice(level)}
                    />
                    <span className="text-sm font-medium tabular-nums">
                      {priceLevelLabel(level)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {level === 1 ? "Affordable" : level === 2 ? "Mid-range" : "Premium"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Open now */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Label htmlFor="open-now" className="text-sm font-semibold">
                Open now
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Only show places taking bookings right now
              </p>
            </div>
            <Switch
              id="open-now"
              checked={draft.openNow}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, openNow: v }))}
            />
          </div>

          {/* Distance */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-semibold">Distance</p>
              <span className="text-[0.8125rem] font-medium text-muted-foreground">
                within {fmtDistance(draft.distance)}
              </span>
            </div>
            <Slider
              min={1}
              max={MAX_DISTANCE}
              step={1}
              value={[draft.distance]}
              onValueChange={([v]) =>
                setDraft((d) => ({ ...d, distance: v ?? MAX_DISTANCE }))
              }
              aria-label="Maximum distance"
            />
            <div className="mt-2 flex justify-between text-[0.625rem] text-muted-foreground">
              <span>1 km</span>
              <span>{MAX_DISTANCE} km</span>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button size="pill" className="w-full" onClick={onApply}>
            Show results
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
