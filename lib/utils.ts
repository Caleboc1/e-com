import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { StoreCurrency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertNairaToDisplayAmount(
  valueInNaira: number,
  currency: StoreCurrency = "NGN",
  usdRate = 1600
) {
  if (currency === "USD") {
    return valueInNaira / Math.max(usdRate, 1);
  }

  return valueInNaira;
}

export function formatPrice(
  valueInNaira: number,
  currency: StoreCurrency = "NGN",
  usdRate = 1600
) {
  const amount = convertNairaToDisplayAmount(valueInNaira, currency, usdRate);

  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0
  }).format(amount);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
