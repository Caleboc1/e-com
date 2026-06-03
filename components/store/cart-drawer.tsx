"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";

import { AdirePattern } from "@/components/store/adire-pattern";
import { useStorefront } from "@/components/store/storefront-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();
  const { currency, formatStorePrice } = useStorefront();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-charcoal/30 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-start justify-between border-b border-linen-dark px-6 py-6">
          <div>
            <h2 className="font-display text-3xl font-light">Your Bag</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.15em] text-text-muted">
              {items.reduce((sum, item) => sum + item.quantity, 0)} items
            </p>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close bag">
            <X className="h-5 w-5 text-earth" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="space-y-4 pt-12 text-center">
              <p className="copy-muted">Your bag is empty.</p>
              <Button variant="outline" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-linen-dark pb-6">
                  <div className="relative aspect-[3/4] w-24 overflow-hidden">
                    <div className="absolute inset-0" style={{ background: item.swatch }} />
                    <AdirePattern variant={item.pattern} opacity={0.35} />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-display text-xl font-light">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-text-muted">
                          {item.color} · Size {item.size}
                        </p>
                      </div>
                      <button type="button" className="text-xs uppercase tracking-[0.18em] text-earth" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-clay">
                        <button className="px-3 py-2 text-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button className="px-3 py-2 text-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <span className="text-sm text-earth">{formatStorePrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-linen-dark px-6 py-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="uppercase tracking-[0.18em] text-clay-dark">Subtotal</span>
              <span className="text-earth">{formatStorePrice(subtotal)}</span>
            </div>
            <p className="mb-5 text-sm text-text-muted">
              {subtotal >= 150000
                ? "You qualify for free shipping."
                : `Add ${formatStorePrice(150000 - subtotal)} for free shipping.`}
            </p>
            {currency !== "NGN" ? (
              <p className="mb-5 text-xs uppercase tracking-[0.14em] text-text-muted">
                Prices are shown in {currency}. Paystack checkout will charge {currency}.
              </p>
            ) : null}
            <Link href="/checkout" onClick={closeCart} className={`${buttonVariants()} w-full`}>
              Proceed to Checkout
            </Link>
          </footer>
        ) : null}
      </aside>
    </>
  );
}
