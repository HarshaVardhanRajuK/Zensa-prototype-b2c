"use client";

import * as React from "react";
import {
  CONSENTS,
  NOTIFICATIONS,
  type CartLine,
  type Consent,
  type ID,
} from "@/lib/mock";

/**
 * A tiny client-only store for prototype interactivity (no backend).
 * Holds cart lines, saved providers, consent toggles and notification
 * read-state so the experience feels alive across screens.
 */
interface AppStoreValue {
  cart: CartLine[];
  cartCount: number;
  addToCart: (productId: ID, variant: string, qty?: number) => void;
  setQty: (productId: ID, variant: string, qty: number) => void;
  removeFromCart: (productId: ID, variant: string) => void;
  clearCart: () => void;

  saved: ID[];
  isSaved: (businessId: ID) => boolean;
  toggleSaved: (businessId: ID) => void;

  consents: Consent[];
  setConsent: (id: ID, granted: boolean) => void;

  readIds: Set<ID>;
  unreadCount: number;
  markRead: (id: ID) => void;
  markAllRead: () => void;
}

const AppStoreContext = React.createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [saved, setSaved] = React.useState<ID[]>(["prana", "lumiere"]);
  const [consents, setConsents] = React.useState<Consent[]>(CONSENTS);
  const [readIds, setReadIds] = React.useState<Set<ID>>(
    () => new Set(NOTIFICATIONS.filter((n) => n.read).map((n) => n.id)),
  );

  const addToCart = React.useCallback((productId: ID, variant: string, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variant === variant);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i]!, qty: next[i]!.qty + qty };
        return next;
      }
      return [...prev, { productId, variant, qty }];
    });
  }, []);

  const setQty = React.useCallback((productId: ID, variant: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId && l.variant === variant ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeFromCart = React.useCallback((productId: ID, variant: string) => {
    setCart((prev) => prev.filter((l) => !(l.productId === productId && l.variant === variant)));
  }, []);

  const clearCart = React.useCallback(() => setCart([]), []);

  const toggleSaved = React.useCallback((businessId: ID) => {
    setSaved((prev) =>
      prev.includes(businessId) ? prev.filter((id) => id !== businessId) : [...prev, businessId],
    );
  }, []);

  const setConsent = React.useCallback((id: ID, granted: boolean) => {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, granted } : c)));
  }, []);

  const markRead = React.useCallback((id: ID) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const markAllRead = React.useCallback(() => {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }, []);

  const value: AppStoreValue = {
    cart,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    saved,
    isSaved: (id) => saved.includes(id),
    toggleSaved,
    consents,
    setConsent,
    readIds,
    unreadCount: NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length,
    markRead,
    markAllRead,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = React.useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
