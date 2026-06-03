"use client";

import { createContext, useContext } from "react";

import { formatPrice } from "@/lib/utils";
import type { StoreCurrency, StoreSettings } from "@/types";

interface StorefrontContextValue {
  currency: StoreCurrency;
  settings: StoreSettings;
  formatStorePrice: (valueInNaira: number) => string;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({
  children,
  currency,
  settings
}: {
  children: React.ReactNode;
  currency: StoreCurrency;
  settings: StoreSettings;
}) {
  return (
    <StorefrontContext.Provider
      value={{
        currency,
        settings,
        formatStorePrice: (valueInNaira) => formatPrice(valueInNaira, currency, settings)
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used inside StorefrontProvider");
  }

  return context;
}
