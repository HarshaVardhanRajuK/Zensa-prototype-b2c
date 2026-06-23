import {
  Activity,
  Flower2,
  HeartPulse,
  Leaf,
  Scissors,
  Sparkles,
  Sun,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Gradient, Vertical } from "@/lib/mock/types";

export interface VerticalMeta {
  label: string;
  icon: LucideIcon;
  gradient: Gradient;
}

export const VERTICAL_META: Record<Vertical, VerticalMeta> = {
  spa: { label: "Spa & Massage", icon: Waves, gradient: "eucalyptus" },
  salon: { label: "Hair & Beauty", icon: Scissors, gradient: "blush" },
  yoga: { label: "Yoga & Meditation", icon: Wind, gradient: "sage" },
  fitness: { label: "Fitness & Movement", icon: Activity, gradient: "ocean" },
  ayurveda: { label: "Ayurveda", icon: Leaf, gradient: "forest" },
  physio: { label: "Physiotherapy", icon: HeartPulse, gradient: "mist" },
  therapy: { label: "Therapy & Counselling", icon: Sparkles, gradient: "lavender" },
  skin: { label: "Skin & Aesthetics", icon: Sun, gradient: "clay" },
  retreat: { label: "Retreats & Stays", icon: Flower2, gradient: "amber" },
};

export function verticalLabel(v: Vertical): string {
  return VERTICAL_META[v].label;
}

export function priceLevelLabel(level: 1 | 2 | 3): string {
  return "$".repeat(level);
}
