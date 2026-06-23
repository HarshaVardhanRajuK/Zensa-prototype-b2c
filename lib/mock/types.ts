import type { Money } from "@/lib/money";

export type ID = string;

/** Wellness verticals (Appendix A families, condensed for the consumer surface). */
export type Vertical =
  | "spa"
  | "salon"
  | "yoga"
  | "fitness"
  | "ayurveda"
  | "physio"
  | "therapy"
  | "skin"
  | "retreat";

/** Named gradient key into the media catalog (lib/media.ts). */
export type Gradient =
  | "sage"
  | "forest"
  | "eucalyptus"
  | "ocean"
  | "mist"
  | "lavender"
  | "blush"
  | "clay"
  | "amber"
  | "sand"
  | "rose"
  | "dusk"
  | "stone";

/* ---------- Consumer (the signed-in user) ---------- */

export interface Consumer {
  id: ID;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  city: string;
  memberSinceIso: string;
  avatarGradient: Gradient;
  loyaltyTier: string;
}

/* ---------- Business ---------- */

export interface OpeningHour {
  day: string;
  open: string; // "09:00"
  close: string; // "20:00"
  closed?: boolean;
}

export interface Business {
  id: ID;
  name: string;
  vertical: Vertical;
  tagline: string;
  about: string;
  city: string;
  neighborhood: string;
  address: string;
  currency: Money["currency"];
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3; // $ $$ $$$
  distanceKm: number;
  /** normalized 0..1 map coordinates for the prototype map placeholder */
  mapX: number;
  mapY: number;
  gradient: Gradient;
  gallery: Gradient[];
  amenities: string[];
  verified: boolean;
  openNow: boolean;
  hours: OpeningHour[];
  serviceIds: ID[];
  productIds: ID[];
  programIds: ID[];
  staffIds: ID[];
  isResidential?: boolean;
}

/* ---------- Catalog ---------- */

export interface ServiceVariation {
  name: string;
  durationMin: number;
  price: Money;
}

export interface Service {
  id: ID;
  businessId: ID;
  name: string;
  category: string;
  description: string;
  durationMin: number;
  price: Money;
  variations: ServiceVariation[];
  includedItems: string[];
  rating: number;
  reviewCount: number;
  gradient: Gradient;
  popular?: boolean;
}

export interface Staff {
  id: ID;
  businessId: ID;
  name: string;
  role: string;
  bio: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  yearsExperience: number;
  avatarGradient: Gradient;
}

export interface Review {
  id: ID;
  businessId: ID;
  serviceId?: ID;
  staffId?: ID;
  author: string;
  rating: number;
  dateIso: string;
  body: string;
  helpful: number;
  verified: boolean;
}

export interface Product {
  id: ID;
  businessId: ID;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: Money;
  compareAtPrice?: Money;
  rating: number;
  reviewCount: number;
  gradient: Gradient;
  variants: string[];
  inStock: boolean;
}

/* ---------- Programs ---------- */

export type ComponentType =
  | "consultation"
  | "service"
  | "class"
  | "assessment"
  | "product";

export interface ProgramComponent {
  title: string;
  type: ComponentType;
  durationMin?: number;
  done?: boolean;
  scheduledIso?: string;
}

export interface Program {
  id: ID;
  businessId: ID;
  name: string;
  category: string;
  summary: string;
  description: string;
  durationLabel: string; // "6 weeks", "21 days"
  sessionsTotal: number;
  price: Money;
  gradient: Gradient;
  components: ProgramComponent[];
}

export type EnrollmentStatus = "active" | "completed" | "paused";

export interface Milestone {
  id: ID;
  title: string;
  description: string;
  dateIso?: string;
  achieved: boolean;
}

export interface ActiveProgram {
  id: ID;
  programId: ID;
  businessId: ID;
  enrolledIso: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  nextSessionIso?: string;
  status: EnrollmentStatus;
  milestones: Milestone[];
}

/* ---------- Commerce engines (held by the consumer) ---------- */

export type HeldStatus = "active" | "expiring" | "expired" | "paused" | "cancelled";

export interface MembershipPlan {
  id: ID;
  businessId: ID;
  name: string;
  price: Money;
  period: "month" | "year";
  benefits: string[];
  discountPercent?: number;
  gradient: Gradient;
  highlight?: boolean;
}

export interface ConsumerMembership {
  id: ID;
  planId: ID;
  businessId: ID;
  name: string;
  status: HeldStatus;
  startIso: string;
  renewsIso: string;
  price: Money;
  period: "month" | "year";
  benefits: string[];
  gradient: Gradient;
}

export interface PackagePlan {
  id: ID;
  businessId: ID;
  name: string;
  sessionsTotal: number;
  price: Money;
  validityLabel: string;
  scope: string;
  gradient: Gradient;
}

export interface PackageRedemption {
  dateIso: string;
  serviceName: string;
}

export interface ConsumerPackage {
  id: ID;
  businessId: ID;
  name: string;
  sessionsTotal: number;
  sessionsUsed: number;
  purchasedIso: string;
  expiryIso: string;
  status: HeldStatus;
  gradient: Gradient;
  scope: string;
  redemptions: PackageRedemption[];
}

export type SubStatus = "active" | "paused" | "cancelled";

export interface ConsumerSubscription {
  id: ID;
  businessId: ID;
  name: string;
  price: Money;
  period: "month" | "year";
  status: SubStatus;
  startIso: string;
  renewsIso: string;
  benefits: string[];
  gradient: Gradient;
}

export interface GiftCard {
  id: ID;
  code: string;
  balance: Money;
  originalValue: Money;
  fromName?: string;
  message?: string;
  expiryIso: string;
  gradient: Gradient;
}

export interface StoreCredit {
  id: ID;
  businessId: ID;
  businessName: string;
  balance: Money;
  reason: string;
  earnedIso: string;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
}

export interface LoyaltyActivity {
  dateIso: string;
  label: string;
  points: number; // +earn / -redeem
}

export interface Loyalty {
  points: number;
  tier: string;
  nextTier?: string;
  pointsToNextTier?: number;
  activity: LoyaltyActivity[];
}

/* ---------- Bookings ---------- */

export type BookingStatus =
  | "upcoming"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "in_progress";

export type PaidWith =
  | { kind: "card"; label: string }
  | { kind: "package"; packageId: ID; label: string }
  | { kind: "membership"; membershipId: ID; label: string }
  | { kind: "free"; label: string };

export interface Booking {
  id: ID;
  businessId: ID;
  businessName: string;
  serviceId: ID;
  serviceName: string;
  staffId?: ID;
  staffName?: string;
  startIso: string;
  endIso: string;
  status: BookingStatus;
  total: Money;
  paidWith: PaidWith;
  locationName: string;
  address: string;
  notes?: string;
  participants?: number;
  cancellationWindowHours: number;
  gradient: Gradient;
}

/* ---------- Stays / Retreats ---------- */

export interface RoomType {
  name: string;
  description: string;
  pricePerNight: Money;
  capacity: number;
}

export interface ItineraryItem {
  time: string; // "07:00"
  title: string;
  type: ComponentType | "meal" | "free";
}

export interface ItineraryDay {
  day: number;
  label: string;
  items: ItineraryItem[];
}

export interface Stay {
  id: ID;
  businessId: ID;
  name: string;
  location: string;
  summary: string;
  description: string;
  nights: number;
  fromPrice: Money;
  gradient: Gradient;
  gallery: Gradient[];
  rating: number;
  reviewCount: number;
  highlights: string[];
  inclusions: string[];
  roomTypes: RoomType[];
  sampleItinerary: ItineraryDay[];
}

export type StayStatus = "reserved" | "confirmed" | "checked_in" | "completed";

export interface ConsumerStay {
  id: ID;
  stayId: ID;
  checkInIso: string;
  checkOutIso: string;
  roomType: string;
  guests: number;
  status: StayStatus;
  total: Money;
}

/* ---------- Journey ---------- */

export type TimelineType =
  | "visit"
  | "milestone"
  | "purchase"
  | "membership"
  | "program"
  | "stay"
  | "assessment"
  | "review"
  | "note";

export interface TimelineEvent {
  id: ID;
  dateIso: string;
  type: TimelineType;
  title: string;
  businessName?: string;
  businessId?: ID;
  detail?: string;
  value?: string;
  gradient: Gradient;
}

export type RecordType = "allergy" | "note" | "measurement" | "assessment" | "preference";

export interface WellnessRecord {
  id: ID;
  type: RecordType;
  title: string;
  value?: string;
  source?: string;
  dateIso: string;
  sharedWith: ID[]; // businessIds
  ownedByConsumer: boolean;
}

export type ShareStatus = "active" | "revoked";

export interface PassportShare {
  id: ID;
  businessId: ID;
  businessName: string;
  scope: string[];
  grantedIso: string;
  status: ShareStatus;
}

/* ---------- Profile & system ---------- */

export interface PaymentMethod {
  id: ID;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export type ConsentType = "marketing" | "passport" | "analytics" | "personalization";

export interface Consent {
  id: ID;
  type: ConsentType;
  label: string;
  description: string;
  granted: boolean;
  required?: boolean;
}

export interface Device {
  id: ID;
  name: string;
  location: string;
  lastActiveIso: string;
  current: boolean;
}

export type NotificationType =
  | "reminder"
  | "program"
  | "membership"
  | "offer"
  | "review"
  | "waitlist"
  | "passport"
  | "loyalty";

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  body: string;
  dateIso: string;
  read: boolean;
}

/* ---------- Discovery taxonomy ---------- */

export interface Category {
  id: ID;
  label: string;
  vertical: Vertical;
  gradient: Gradient;
}

export interface Collection {
  id: ID;
  title: string;
  subtitle: string;
  gradient: Gradient;
  businessIds: ID[];
}

/* ---------- Store cart / orders ---------- */

export interface CartLine {
  productId: ID;
  variant: string;
  qty: number;
}

export type OrderStatus = "processing" | "ready" | "completed" | "cancelled";

export interface OrderLine {
  productName: string;
  variant: string;
  qty: number;
  price: Money;
}

export interface Order {
  id: ID;
  dateIso: string;
  businessName: string;
  status: OrderStatus;
  lines: OrderLine[];
  total: Money;
  fulfilment: "pickup";
}
