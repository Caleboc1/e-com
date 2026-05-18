"use client";

import Link from "next/link";

import { useCart } from "@/components/store/cart-provider";
import { useStorefront } from "@/components/store/storefront-provider";
import { AdirePattern } from "@/components/store/adire-pattern";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { formatStorePrice } = useStorefront();
  const primaryView = product.views[0];

  return (
    <div className="group relative bg-white">
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />
      <div className="relative aspect-[3/4] overflow-hidden bg-linen">
        {primaryView?.imageUrl ? (
          <img
            src={primaryView.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: product.swatch }} />
            <AdirePattern variant={product.pattern} opacity={product.print === "adire" ? 0.38 : 0.16} />
          </>
        )}
      </div>
      <div className="space-y-2 px-5 py-6">
        <div className="font-display text-[1.25rem] font-light">{product.name}</div>
        <div className="text-sm text-text-muted">{product.material}</div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-earth">{formatStorePrice(product.price)}</div>
          <button
            type="button"
            className="relative z-20 text-[0.72rem] uppercase tracking-[0.18em] text-clay-dark transition-colors hover:text-charcoal"
            onClick={(event) => {
              event.preventDefault();
              addItem(product, {
                size: product.sizes[0] ?? "One Size",
                color: product.colors[0]?.name ?? "Default"
              });
            }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
