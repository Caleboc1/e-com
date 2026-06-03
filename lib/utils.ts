import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { StoreCurrency, StoreSettings } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultStoreSettings: StoreSettings = {
  usdRate: 1600,
  ghsRate: 100,
  lagosDeliveryFee: 0,
  nigeriaDeliveryFee: 0,
  internationalDeliveryFee: 0
};

export function getDeliveryFee(country: string, state: string, settings: StoreSettings): number {
  const c = country.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  const isNigeria = c === "nigeria" || c === "ng" || c === "nga";
  if (!isNigeria) return settings.internationalDeliveryFee;
  if (s === "lagos") return settings.lagosDeliveryFee;
  return settings.nigeriaDeliveryFee;
}

function getCurrencyLocale(currency: StoreCurrency) {
  if (currency === "USD") {
    return "en-US";
  }

  if (currency === "GHS") {
    return "en-GH";
  }

  return "en-NG";
}

function getCurrencyRate(currency: StoreCurrency, settings: StoreSettings = defaultStoreSettings) {
  if (currency === "USD") {
    return Math.max(settings.usdRate, 1);
  }

  if (currency === "GHS") {
    return Math.max(settings.ghsRate, 1);
  }

  return 1;
}

export function convertNairaToDisplayAmount(
  valueInNaira: number,
  currency: StoreCurrency = "NGN",
  settings: StoreSettings = defaultStoreSettings
) {
  return valueInNaira / getCurrencyRate(currency, settings);
}

export function getPaystackAmountInSubunits(
  valueInNaira: number,
  currency: StoreCurrency = "NGN",
  settings: StoreSettings = defaultStoreSettings
) {
  return Math.round(convertNairaToDisplayAmount(valueInNaira, currency, settings) * 100);
}

export function formatCurrencyAmount(amount: number, currency: StoreCurrency = "NGN") {
  return new Intl.NumberFormat(getCurrencyLocale(currency), {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2
  }).format(amount);
}

export function formatCurrencySubunit(amountInSubunits: number, currency: StoreCurrency = "NGN") {
  return formatCurrencyAmount(amountInSubunits / 100, currency);
}

export function formatPrice(
  valueInNaira: number,
  currency: StoreCurrency = "NGN",
  settings: StoreSettings = defaultStoreSettings
) {
  return formatCurrencyAmount(convertNairaToDisplayAmount(valueInNaira, currency, settings), currency);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
