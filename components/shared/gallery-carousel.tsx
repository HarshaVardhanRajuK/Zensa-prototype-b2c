"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MediaImage } from "@/components/shared/media-image";
import type { Gradient } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

/** Swipeable hero gallery of generative gradient "photos". */
export function GalleryCarousel({
  slides,
  className,
  scrim = true,
  children,
}: {
  slides: Gradient[];
  className?: string;
  scrim?: boolean;
  children?: React.ReactNode;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <div className={cn("relative", className)}>
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((g, i) => (
            <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
              <MediaImage gradient={g} scrim={scrim} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
      {children}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full bg-white transition-all",
                i === selected ? "w-5 opacity-100" : "w-1.5 opacity-50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
