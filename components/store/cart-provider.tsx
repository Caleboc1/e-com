"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, options: { size: string; color: string }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "saiia-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored) as CartItem[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      isOpen,
      itemCount,
      subtotal,
      addItem: (product, options) => {
        setItems((current) => {
          const existing = current.find(
            (item) =>
              item.productId === product.id &&
              item.size === options.size &&
              item.color === options.color
          );

          if (existing) {
            return current.map((item) =>
              item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }

          const colorConfig = product.colors.find((color) => color.name === options.color) ?? product.colors[0];

          return [
            ...current,
            {
              id: `${product.id}-${options.size}-${options.color}`,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              color: options.color,
              size: options.size,
              quantity: 1,
              price: product.price,
              swatch: colorConfig?.swatchColor ?? product.swatch,
              pattern: colorConfig?.pattern ?? product.pattern
            }
          ];
        });
        setIsOpen(true);
      },
      updateQuantity: (itemId, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.id === itemId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (itemId) => {
        setItems((current) => current.filter((item) => item.id !== itemId));
      },
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      clearCart: () => setItems([])
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
