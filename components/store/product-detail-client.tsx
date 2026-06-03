"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AdirePattern } from "@/components/store/adire-pattern";
import { useStorefront } from "@/components/store/storefront-provider";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";
import type { Product } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeView, setActiveView] = useState(product.views[0]?.id ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id ?? "");
  const [openSection, setOpenSection] = useState<"details" | "shipping">("details");
  const { addItem } = useCart();
  const { currency, formatStorePrice } = useStorefront();

  const currentView = product.views.find((view) => view.id === activeView) ?? product.views[0];
  const currentColor = product.colors.find((color) => color.id === selectedColor) ?? product.colors[0];
  const displaySwatch = currentColor?.swatchColor ?? currentView?.swatchColor ?? product.swatch;
  const displayPattern = currentColor?.pattern ?? currentView?.pattern ?? product.pattern;

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 md:px-12">
      <nav className="flex items-center gap-2 py-6 text-[0.7rem] uppercase tracking-[0.15em] text-text-muted">
        <Link href="/" className="text-earth transition-colors hover:text-charcoal">
          Home
        </Link>
        <span>·</span>
        <Link href="/shop" className="text-earth transition-colors hover:text-charcoal">
          Shop
        </Link>
        <span>·</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        <section className="grid gap-4 lg:sticky lg:top-24 lg:grid-cols-[88px_1fr] lg:self-start">
          <div className="flex gap-3 lg:flex-col">
            {product.views.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
                className={`relative aspect-[3/4] w-20 overflow-hidden border ${activeView === view.id ? "border-charcoal opacity-100" : "border-transparent opacity-60"} transition-opacity`}
              >
                {view.imageUrl ? (
                  <Image
                    src={view.imageUrl}
                    alt={`${product.name} ${view.label}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0" style={{ background: displaySwatch }} />
                    <AdirePattern variant={displayPattern} opacity={0.35} />
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="relative aspect-[3/4] overflow-hidden bg-linen">
            {currentView?.imageUrl ? (
              <Image
                src={currentView.imageUrl}
                alt={`${product.name} ${currentView.label}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: displaySwatch }} />
                <AdirePattern variant={displayPattern} opacity={0.4} />
              </>
            )}
            <span className="absolute bottom-4 left-4 bg-black/20 px-3 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/55 backdrop-blur">
              {currentView?.label}
            </span>
          </div>
        </section>

        <section className="pt-4">
          <span className="section-tag">Collection No. 01</span>
          <h1 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-light leading-tight">{product.name}</h1>
          <p className="mt-3 text-base text-earth">{formatStorePrice(product.price)}</p>
          {currency !== "NGN" ? (
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-text-muted">
              Displayed in {currency} for your location. Checkout will be processed in {currency}.
            </p>
          ) : null}
          <p className="mt-8 max-w-xl text-sm leading-8 text-text-muted">{product.description}</p>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <span className="section-tag mb-0">Colour</span>
              <span className="text-sm text-charcoal">{currentColor?.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`relative h-11 w-11 overflow-hidden outline outline-1 outline-offset-4 transition-transform hover:scale-105 ${selectedColor === color.id ? "outline-charcoal" : "outline-transparent"}`}
                  style={{ background: color.swatchColor }}
                  onClick={() => setSelectedColor(color.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <span className="section-tag mb-0">Size</span>
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-earth">Size guide</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`border px-4 py-4 text-[0.75rem] uppercase tracking-[0.1em] transition-colors ${selectedSize === size ? "border-charcoal bg-charcoal text-white" : "border-clay bg-transparent text-charcoal hover:border-charcoal"}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="mt-10 w-full max-w-sm"
            onClick={() =>
              addItem(product, {
                size: selectedSize,
                color: currentColor?.name ?? "Default"
              })
            }
          >
            Add to Bag
          </Button>

          <div className="mt-10 border-t border-linen-dark">
            <Accordion
              title="Details & Fit"
              isOpen={openSection === "details"}
              onToggle={() => setOpenSection(openSection === "details" ? "shipping" : "details")}
            >
              <ul className="space-y-3 text-sm leading-7 text-text-muted">
                {product.details.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion
              title="Shipping & Returns"
              isOpen={openSection === "shipping"}
              onToggle={() => setOpenSection(openSection === "shipping" ? "details" : "shipping")}
            >
              <ul className="space-y-3 text-sm leading-7 text-text-muted">
                {product.shipping.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Accordion>
          </div>
        </section>
      </div>
    </div>
  );
}

function Accordion({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-linen-dark py-5">
      <button type="button" className="flex w-full items-center justify-between" onClick={onToggle}>
        <span className="text-[0.8rem] uppercase tracking-[0.18em] text-charcoal">{title}</span>
        <span className={`text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`grid transition-all ${isOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
