import { headers } from "next/headers";

import type { StoreCurrency } from "@/types";

const COUNTRY_HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-country"
];

export function getCurrencyForCountry(country: string | null | undefined): StoreCurrency {
  const normalizedCountry = country?.trim().toUpperCase();

  if (normalizedCountry === "GH" || normalizedCountry === "GHA" || normalizedCountry === "GHANA") {
    return "GHS";
  }

  if (normalizedCountry === "NG" || normalizedCountry === "NGA" || normalizedCountry === "NIGERIA") {
    return "NGN";
  }

  return "USD";
}

export async function getPreferredCurrency(): Promise<StoreCurrency> {
  const headerStore = await headers();
  const country = COUNTRY_HEADER_KEYS.map((key) => headerStore.get(key)?.toUpperCase()).find(Boolean);

  return getCurrencyForCountry(country);
}
