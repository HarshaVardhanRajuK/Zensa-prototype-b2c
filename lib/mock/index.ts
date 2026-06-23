/**
 * Query helpers over the static mock data — the prototype's "repositories".
 * Screens import from here, never from data.ts directly, so lookups stay
 * consistent and centralised.
 */
import type {
  ActiveProgram,
  Booking,
  Business,
  ConsumerMembership,
  ConsumerPackage,
  ID,
  Product,
  Program,
  Review,
  Service,
  Staff,
  Stay,
  Vertical,
} from "./types";
import {
  ACTIVE_PROGRAMS,
  BOOKINGS,
  BUSINESSES,
  CONSUMER_MEMBERSHIPS,
  CONSUMER_PACKAGES,
  COLLECTIONS,
  PRODUCTS,
  PROGRAMS,
  REVIEWS,
  SERVICES,
  STAFF,
  STAYS,
} from "./data";

export * from "./data";
export type * from "./types";

/* ---------- Businesses ---------- */

export function getBusiness(id: ID): Business | undefined {
  return BUSINESSES.find((b) => b.id === id);
}

export function businessesByVertical(v: Vertical): Business[] {
  return BUSINESSES.filter((b) => b.vertical === v);
}

export function nearbyBusinesses(limit = 6): Business[] {
  return [...BUSINESSES]
    .filter((b) => b.distanceKm > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function topRatedBusinesses(limit = 6): Business[] {
  return [...BUSINESSES].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function searchBusinesses(query: string): Business[] {
  const q = query.trim().toLowerCase();
  if (!q) return BUSINESSES;
  return BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.vertical.includes(q) ||
      b.neighborhood.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q),
  );
}

/* ---------- Catalog ---------- */

export function getService(id: ID): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function servicesForBusiness(businessId: ID): Service[] {
  return SERVICES.filter((s) => s.businessId === businessId);
}

export function popularServices(limit = 6): Service[] {
  return SERVICES.filter((s) => s.popular).slice(0, limit);
}

export function getProduct(id: ID): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsForBusiness(businessId: ID): Product[] {
  return PRODUCTS.filter((p) => p.businessId === businessId);
}

export function allProducts(): Product[] {
  return PRODUCTS;
}

export function getProgram(id: ID): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function programsForBusiness(businessId: ID): Program[] {
  return PROGRAMS.filter((p) => p.businessId === businessId);
}

/* ---------- People ---------- */

export function getStaff(id: ID): Staff | undefined {
  return STAFF.find((s) => s.id === id);
}

export function staffForBusiness(businessId: ID): Staff[] {
  return STAFF.filter((s) => s.businessId === businessId);
}

/* ---------- Reviews ---------- */

export function reviewsForBusiness(businessId: ID): Review[] {
  return REVIEWS.filter((r) => r.businessId === businessId).sort(
    (a, b) => +new Date(b.dateIso) - +new Date(a.dateIso),
  );
}

export function reviewsForService(serviceId: ID): Review[] {
  return REVIEWS.filter((r) => r.serviceId === serviceId);
}

/* ---------- Bookings ---------- */

export function getBooking(id: ID): Booking | undefined {
  return BOOKINGS.find((b) => b.id === id);
}

export function upcomingBookings(): Booking[] {
  return BOOKINGS.filter(
    (b) => b.status === "upcoming" || b.status === "confirmed" || b.status === "in_progress",
  ).sort((a, b) => +new Date(a.startIso) - +new Date(b.startIso));
}

export function pastBookings(): Booking[] {
  return BOOKINGS.filter((b) => b.status === "completed" || b.status === "cancelled").sort(
    (a, b) => +new Date(b.startIso) - +new Date(a.startIso),
  );
}

export function nextBooking(): Booking | undefined {
  return upcomingBookings()[0];
}

/* ---------- Programs (enrolled) ---------- */

export function getActiveProgram(id: ID): ActiveProgram | undefined {
  return ACTIVE_PROGRAMS.find((p) => p.id === id);
}

export function activeProgramByProgramId(programId: ID): ActiveProgram | undefined {
  return ACTIVE_PROGRAMS.find((p) => p.programId === programId);
}

/* ---------- Wallet ---------- */

export function membershipsForBusiness(businessId: ID): ConsumerMembership[] {
  return CONSUMER_MEMBERSHIPS.filter((m) => m.businessId === businessId);
}

export function packagesForBusiness(businessId: ID): ConsumerPackage[] {
  return CONSUMER_PACKAGES.filter((p) => p.businessId === businessId && p.status !== "expired");
}

/* ---------- Stays ---------- */

export function getStay(id: ID): Stay | undefined {
  return STAYS.find((s) => s.id === id);
}

export function residentialStays(): Stay[] {
  return STAYS;
}

/* ---------- Recently visited (derived from bookings) ---------- */

export function recentProviders(limit = 5): Business[] {
  const seen = new Set<ID>();
  const result: Business[] = [];
  for (const bk of pastBookings()) {
    if (seen.has(bk.businessId)) continue;
    seen.add(bk.businessId);
    const biz = getBusiness(bk.businessId);
    if (biz) result.push(biz);
    if (result.length >= limit) break;
  }
  return result;
}

export function collectionBusinesses(collectionId: ID): Business[] {
  const col = COLLECTIONS.find((c) => c.id === collectionId);
  if (!col) return [];
  return col.businessIds.map(getBusiness).filter((b): b is Business => Boolean(b));
}
