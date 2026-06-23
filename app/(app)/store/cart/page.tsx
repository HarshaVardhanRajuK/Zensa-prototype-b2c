"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { PriceTag } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { StackHeader } from "@/components/shell/headers";
import { useAppStore } from "@/components/providers/app-store";
import { getProduct } from "@/lib/mock";
import type { CartLine, Product } from "@/lib/mock";
import { formatMoney, money, multiplyMoney, sumMoney } from "@/lib/money";

interface ResolvedLine {
  line: CartLine;
  product: Product;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, setQty, removeFromCart } = useAppStore();

  const resolved: ResolvedLine[] = cart
    .map((line) => {
      const product = getProduct(line.productId);
      return product ? { line, product } : null;
    })
    .filter((r): r is ResolvedLine => r !== null);

  const currency = resolved[0]?.product.price.currency ?? "EUR";
  const subtotal = sumMoney(
    resolved.map((r) => multiplyMoney(r.product.price, r.line.qty)),
    currency,
  );

  if (resolved.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <StackHeader title="Cart" backHref="/store" />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the shop to find products that extend your rituals at home."
          actionLabel="Browse the shop"
          onAction={() => router.push("/store")}
          className="flex-1"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <StackHeader title="Cart" backHref="/store" />

      <div className="space-y-3 px-5 pb-8 pt-5">
        {resolved.map(({ line, product }) => {
          const lineTotal = multiplyMoney(product.price, line.qty);
          return (
            <article
              key={`${line.productId}-${line.variant}`}
              className="flex gap-3.5 rounded-3xl border bg-card p-3.5"
            >
              <Link href={`/store/product/${product.id}`} className="shrink-0">
                <MediaImage gradient={product.gradient} className="h-20 w-20 rounded-2xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      {product.brand}
                    </p>
                    <Link href={`/store/product/${product.id}`}>
                      <h3 className="line-clamp-1 text-sm font-semibold">{product.name}</h3>
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">{line.variant}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => removeFromCart(line.productId, line.variant)}
                    className="-me-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="inline-flex items-center gap-1 rounded-2xl border bg-card p-0.5">
                    <QtyButton
                      label="Decrease quantity"
                      icon={Minus}
                      onClick={() =>
                        setQty(line.productId, line.variant, Math.max(0, line.qty - 1))
                      }
                    />
                    <span className="w-7 text-center text-sm font-semibold tabular-nums">
                      {line.qty}
                    </span>
                    <QtyButton
                      label="Increase quantity"
                      icon={Plus}
                      disabled={line.qty >= 9}
                      onClick={() => setQty(line.productId, line.variant, line.qty + 1)}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatMoney(lineTotal)}
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {/* Order summary */}
        <div className="mt-3 rounded-3xl border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold tabular-nums">{formatMoney(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Taxes are shown at checkout. Items are collected in store.
          </p>
        </div>
      </div>

      <FlowFooter
        primary={
          <Link href="/store/checkout" className="block">
            <FooterButton>Checkout</FooterButton>
          </Link>
        }
      >
        <div>
          <p className="text-xs text-muted-foreground">Subtotal</p>
          <p className="text-base font-semibold tabular-nums">{formatMoney(subtotal)}</p>
        </div>
      </FlowFooter>
    </div>
  );
}

function QtyButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
