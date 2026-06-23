"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  PackageX,
} from "lucide-react";
import {
  Pill,
  PriceTag,
  RatingInline,
  RatingStars,
  InfoRow,
  SectionHeader,
} from "@/components/shared/primitives";
import { ReviewCard } from "@/components/shared/review-card";
import { MediaImage } from "@/components/shared/media-image";
import { FlowFooter, FooterButton } from "@/components/shared/flow-footer";
import { StackHeader, IconButton } from "@/components/shell/headers";
import { useAppStore } from "@/components/providers/app-store";
import { useToast } from "@/components/providers/toast-provider";
import {
  getProduct,
  getBusiness,
  reviewsForBusiness,
} from "@/lib/mock";
import { multiplyMoney } from "@/lib/money";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProduct(params.id);
  const business = product ? getBusiness(product.businessId) : undefined;
  const { cartCount, addToCart } = useAppStore();
  const { toast } = useToast();

  const [variant, setVariant] = React.useState<string>(
    product?.variants[0] ?? "Standard",
  );
  const [qty, setQty] = React.useState(1);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <PackageX className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">We couldn&apos;t find that product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have sold out or is no longer listed.
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </div>
    );
  }

  const soldOut = !product.inStock;
  const reviews = business ? reviewsForBusiness(business.id) : [];
  const lineTotal = multiplyMoney(product.price, qty);

  const handleAdd = () => {
    addToCart(product.id, variant, qty);
    toast({
      title: "Added to cart",
      description: `${product.name} · ${variant} · ×${qty}`,
      variant: "success",
    });
  };

  const handleBuyNow = () => {
    addToCart(product.id, variant, qty);
    router.push("/store/cart");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero */}
      <div className="relative">
        <MediaImage gradient={product.gradient} scrim className="h-72 w-full">
          <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
            <Pill tone="neutral" className="bg-white/20 text-white">
              {product.category}
            </Pill>
          </div>
        </MediaImage>
        <div className="absolute inset-x-0 top-0">
          <StackHeader
            transparent
            actions={
              <IconButton label="Cart" href="/store/cart" badge={cartCount} className="bg-card/85">
                <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              </IconButton>
            }
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-9 px-5 pb-8 pt-6">
        {/* Header block */}
        <section>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight">
            {product.name}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <PriceTag
              amount={product.price}
              compareAt={product.compareAtPrice}
              className="text-base"
            />
            <span aria-hidden className="text-border">·</span>
            <RatingInline rating={product.rating} count={product.reviewCount} />
            {soldOut && (
              <Pill tone="neutral">Sold out</Pill>
            )}
          </div>
        </section>

        {/* Description */}
        <section>
          <SectionHeader title="About this product" />
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">
            {product.description}
          </p>
        </section>

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <section>
            <SectionHeader title="Choose an option" />
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const active = v === variant;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    aria-pressed={active}
                    className={
                      active
                        ? "inline-flex h-10 items-center rounded-2xl border border-primary bg-primary-soft px-4 text-sm font-semibold text-primary transition-all"
                        : "inline-flex h-10 items-center rounded-2xl border bg-card px-4 text-sm font-medium transition-all active:scale-[0.98] hover:bg-muted"
                    }
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Quantity */}
        <section>
          <SectionHeader title="Quantity" />
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1 rounded-2xl border bg-card p-1">
              <Stepper
                label="Decrease quantity"
                icon={Minus}
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              />
              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <Stepper
                label="Increase quantity"
                icon={Plus}
                disabled={qty >= 9}
                onClick={() => setQty((q) => Math.min(9, q + 1))}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Total <PriceTag amount={lineTotal} className="text-foreground" />
            </p>
          </div>
        </section>

        {/* Pickup */}
        {business && (
          <section>
            <SectionHeader title="Collection" />
            <div className="rounded-3xl border bg-card px-1">
              <InfoRow
                icon={Store}
                label={`Pickup at ${business.name}`}
                value={`${business.neighborhood} · ${business.address}`}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your order is prepared in store. You&apos;ll be notified when it&apos;s ready to collect.
            </p>
          </section>
        )}

        {/* Reviews */}
        {business && reviews.length > 0 && (
          <section>
            <SectionHeader title="Reviews" />
            <div className="mb-4 flex items-center gap-4 rounded-3xl border bg-card p-4">
              <div className="text-center">
                <p className="font-display text-3xl font-semibold leading-none tabular-nums">
                  {product.rating.toFixed(1)}
                </p>
                <div className="mt-1.5 flex justify-center">
                  <RatingStars rating={product.rating} />
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {product.reviewCount.toLocaleString()} reviews
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  From verified customers
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.slice(0, 2).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <FlowFooter
        primary={
          <div className="flex items-center gap-2.5">
            <FooterButton
              variant="outline"
              disabled={soldOut}
              onClick={handleBuyNow}
              className="w-auto flex-1 px-4"
            >
              Buy now
            </FooterButton>
            <FooterButton
              disabled={soldOut}
              onClick={handleAdd}
              className="w-auto flex-1 px-4"
            >
              Add to cart
            </FooterButton>
          </div>
        }
      >
        <div>
          <PriceTag amount={lineTotal} className="text-base" />
          <p className="mt-0.5 text-xs text-muted-foreground">{variant}</p>
        </div>
      </FlowFooter>
    </div>
  );
}

function Stepper({
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
      className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
