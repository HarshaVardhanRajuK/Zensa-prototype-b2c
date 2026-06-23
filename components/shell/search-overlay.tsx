"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Search, TrendingUp } from "lucide-react";
import { CATEGORIES, SERVICES, searchBusinesses, type Business } from "@/lib/mock";
import { VERTICAL_META } from "@/lib/taxonomy";
import { GradientThumb } from "@/components/shared/media-image";
import { cn } from "@/lib/utils";

interface SearchContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

const RECENT = ["Deep tissue massage", "Yoga near me", "Facial"];
const TRENDING = ["Massage", "Reformer pilates", "Ayurveda", "Counselling"];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  React.useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen]);

  const q = query.trim().toLowerCase();
  const businesses: Business[] = q ? searchBusinesses(q).slice(0, 5) : [];
  const services = q
    ? SERVICES.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 4)
    : [];

  function go(href: string) {
    close();
    router.push(href);
  }

  return (
    <SearchContext.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-0 z-[110] mx-auto flex w-full max-w-app flex-col bg-background animate-fade-in">
          <div className="flex items-center gap-2 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
            <button
              onClick={close}
              aria-label="Close search"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-muted px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search treatments, studios, products…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 scrollbar-thin">
            {!q && (
              <div className="space-y-6 pt-2">
                <Section icon={Clock} label="Recent">
                  {RECENT.map((r) => (
                    <Chip key={r} onClick={() => setQuery(r)}>{r}</Chip>
                  ))}
                </Section>
                <Section icon={TrendingUp} label="Trending">
                  {TRENDING.map((r) => (
                    <Chip key={r} onClick={() => setQuery(r)}>{r}</Chip>
                  ))}
                </Section>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Browse categories
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CATEGORIES.map((c) => {
                      const Icon = VERTICAL_META[c.vertical].icon;
                      return (
                        <button
                          key={c.id}
                          onClick={() => go(`/discover?category=${c.vertical}`)}
                          className="flex items-center gap-2.5 rounded-2xl border bg-card p-3 text-start transition-colors hover:bg-muted"
                        >
                          <GradientThumb gradient={c.gradient} className="h-9 w-9 rounded-xl">
                            <Icon className="h-4 w-4 text-white" />
                          </GradientThumb>
                          <span className="text-sm font-medium">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {q && (
              <div className="space-y-5 pt-2">
                {services.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Treatments</p>
                    <div className="space-y-1">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => go(`/service/${s.id}`)}
                          className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-start transition-colors hover:bg-muted"
                        >
                          <GradientThumb gradient={s.gradient} className="h-10 w-10 rounded-xl" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {businesses.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Places</p>
                    <div className="space-y-1">
                      {businesses.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => go(`/business/${b.id}`)}
                          className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-start transition-colors hover:bg-muted"
                        >
                          <GradientThumb gradient={b.gradient} className="h-10 w-10 rounded-xl" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{b.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {VERTICAL_META[b.vertical].label} · {b.neighborhood}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {services.length === 0 && businesses.length === 0 && (
                  <p className="px-1 pt-8 text-center text-sm text-muted-foreground">
                    No matches for “{query}”. Try a treatment or place.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border bg-card px-3.5 py-2 text-[0.8125rem] font-medium text-foreground transition-colors hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = React.useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
