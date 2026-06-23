"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, ShoppingBag, ChevronRight, Package } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import {
  PriceTag,
  RatingInline,
  Pill,
  SectionHeader,
} from "@/components/shared/primitives";
import { ChoiceChip } from "@/components/shared/chips";
import { TabHeader, IconButton } from "@/components/shell/headers";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/components/providers/app-store";
import { useToast } from "@/components/providers/toast-provider";
import { allProducts, ORDERS } from "@/lib/mock";
import type { Product } from "@/lib/mock";
import { ORDER_STATUS } from "@/lib/status";
import { fmtRelative } from "@/lib/datetime";

const ALL = "All";

export default function StorePage() {
  const products = allProducts();
  const { cartCount, addToCart } = useAppStore();
  const { toast } = useToast();
  const [category, setCategory] = React.useState<string>(ALL);

  const categories = React.useMemo<string[]>(() => {
    const set = new Set<string>();
    for (const p of products) set.add(p.category);
    return [ALL, ...Array.from(set)];
  }, [products]);

  const visible =
    category === ALL ? products : products.filter((p) => p.category === category);

  const handleAdd = (product: Product) => {
    const variant = product.variants[0] ?? "Standard";
    addToCart(product.id, variant, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} · ${variant}`,
      variant: "success",
    });
  };

  return (
    <div>
      <TabHeader
        title="Shop"
        subtitle="Take wellness home"
        action={
          <IconButton
            label="Cart"
            href="/store/cart"
            badge={cartCount}
          >
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
          </IconButton>
        }
      />

      {/* Category filter */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-5 pb-1 pt-1">
        {categories.map((c) => (
          <ChoiceChip
            key={c}
            selected={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </ChoiceChip>
        ))}
      </div>

      {/* Product grid */}
      <section className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3.5">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      </section>

      {/* Order history */}
      {ORDERS.length > 0 && (
        <section className="px-5 pb-2 pt-9">
          <SectionHeader title="Your orders" caption="Collected in store" />
          <div className="space-y-3">
            {ORDERS.map((order) => {
              const status = ORDER_STATUS[order.status];
              const itemCount = order.lines.reduce((n, l) => n + l.qty, 0);
              return (
                <article
                  key={order.id}
                  className="flex items-center gap-3.5 rounded-3xl border bg-card p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Package className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {order.businessName}
                      </h3>
                      <Badge variant={status.variant} className="shrink-0">
                        {status.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                      {fmtRelative(order.dateIso)}
                    </p>
                  </div>
                  <PriceTag amount={order.total} className="shrink-0 text-sm" />
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  const soldOut = !product.inStock;
  return (
    <div className="flex flex-col">
      <Link href={`/store/product/${product.id}`} className="block">
        <div className="relative">
          <MediaImage gradient={product.gradient} className="h-40 w-full rounded-3xl" />
          {soldOut && (
            <span className="absolute start-2.5 top-2.5">
              <Pill tone="neutral" className="bg-card/90 backdrop-blur">
                Sold out
              </Pill>
            </span>
          )}
        </div>
        <p className="mt-2.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="line-clamp-1 text-sm font-semibold">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <PriceTag
            amount={product.price}
            compareAt={product.compareAtPrice}
            className="text-[0.8125rem]"
          />
        </div>
        <div className="mt-1">
          <RatingInline rating={product.rating} count={product.reviewCount} />
        </div>
      </Link>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => onAdd(product)}
        className="mt-2.5 inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary-soft text-[0.8125rem] font-semibold text-primary transition-all active:scale-[0.98] hover:bg-primary-soft/70 disabled:pointer-events-none disabled:opacity-50"
      >
        {soldOut ? (
          "Sold out"
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add
          </>
        )}
      </button>
    </div>
  );
}
