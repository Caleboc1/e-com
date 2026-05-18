import { headers } from "next/headers";

import type { StoreCurrency } from "@/types";

const COUNTRY_HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-country"
];

export async function getPreferredCurrency(): Promise<StoreCurrency> {
  const headerStore = await headers();
  const country = COUNTRY_HEADER_KEYS.map((key) => headerStore.get(key)?.toUpperCase()).find(Boolean);

  if (country && country !== "NG") {
    return "USD";
  }

  return "NGN";
}
