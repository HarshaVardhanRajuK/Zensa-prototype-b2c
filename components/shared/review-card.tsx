import * as React from "react";
import { ThumbsUp } from "lucide-react";
import { PersonAvatar } from "@/components/shared/media-image";
import { RatingStars } from "@/components/shared/primitives";
import { Pill } from "@/components/shared/primitives";
import { fmtRelative } from "@/lib/datetime";
import { getStaff } from "@/lib/mock";
import type { Review } from "@/lib/mock/types";

export function ReviewCard({ review }: { review: Review }) {
  const staff = review.staffId ? getStaff(review.staffId) : undefined;
  return (
    <article className="rounded-3xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <PersonAvatar name={review.author} className="h-9 w-9" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{review.author}</p>
            {review.verified && <Pill tone="primary" className="px-1.5 py-0.5 text-[0.625rem]">Verified visit</Pill>}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <RatingStars rating={review.rating} />
            <span className="text-xs text-muted-foreground">{fmtRelative(review.dateIso)}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-foreground/90">{review.body}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {staff && <span>with {staff.name}</span>}
        <span className="ms-auto inline-flex items-center gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful ({review.helpful})
        </span>
      </div>
    </article>
  );
}
