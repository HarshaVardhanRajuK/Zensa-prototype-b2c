import type { Gradient } from "@/lib/mock/types";
import { hashIndex } from "@/lib/utils";

/**
 * Generative "imagery" — calm, multi-stop CSS gradients keyed by name.
 * The prototype is fully self-contained (no external photos): every hero,
 * card and gallery slot uses a tasteful gradient so the app always looks
 * intentional, premium and loads instantly. An optional photo layer can be
 * added later without changing call sites.
 */
export const GRADIENTS: Record<Gradient, string> = {
  sage: "linear-gradient(135deg, hsl(156 30% 62%), hsl(150 28% 42%))",
  forest: "linear-gradient(150deg, hsl(158 32% 38%), hsl(168 36% 20%))",
  eucalyptus: "linear-gradient(135deg, hsl(168 28% 70%), hsl(176 26% 46%))",
  ocean: "linear-gradient(150deg, hsl(196 42% 64%), hsl(204 46% 40%))",
  mist: "linear-gradient(135deg, hsl(190 22% 84%), hsl(200 20% 64%))",
  lavender: "linear-gradient(135deg, hsl(258 34% 78%), hsl(266 28% 56%))",
  blush: "linear-gradient(135deg, hsl(346 56% 84%), hsl(352 44% 66%))",
  clay: "linear-gradient(135deg, hsl(18 64% 70%), hsl(12 54% 52%))",
  amber: "linear-gradient(135deg, hsl(38 78% 70%), hsl(28 70% 52%))",
  sand: "linear-gradient(135deg, hsl(38 44% 84%), hsl(32 34% 66%))",
  rose: "linear-gradient(135deg, hsl(8 60% 78%), hsl(356 48% 60%))",
  dusk: "linear-gradient(160deg, hsl(232 34% 56%), hsl(282 30% 42%))",
  stone: "linear-gradient(135deg, hsl(40 14% 76%), hsl(150 8% 52%))",
};

/** Soft overlay used over gradients to seat foreground text legibly. */
export const MEDIA_SCRIM =
  "linear-gradient(180deg, hsl(150 24% 12% / 0) 35%, hsl(150 24% 12% / 0.55) 100%)";

const KEYS = Object.keys(GRADIENTS) as Gradient[];

export function gradientFor(seed: string): Gradient {
  return KEYS[hashIndex(seed, KEYS.length)]!;
}

export function gradientCss(g: Gradient): string {
  return GRADIENTS[g];
}
