import { cache } from "react";
import type { Prisma } from "@prisma/client";

import { mockMetrics, mockOrders, mockProducts } from "@/lib/mock-data";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import type { DashboardMetrics, OrderRecord, Product, StoreSettings } from "@/types";

function asStringArray(value: Prisma.JsonValue | null | undefined) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function asTypedArray<T>(value: Prisma.JsonValue | null | undefined) {
  return Array.isArray(value) ? (value as unknown as T[]) : [];
}

function mapProductRow(row: {
  id: string;
  slug: string;
  name: string;
  description: string;
  material: string;
  price: number;
  category: Product["category"];
  type: string;
  print: Product["print"];
  inventory: number;
  featured: boolean;
  swatch: string;
  pattern: string;
  details: Prisma.JsonValue;
  shipping: Prisma.JsonValue;
  sizes: Prisma.JsonValue;
  colors: Prisma.JsonValue;
  views: Prisma.JsonValue;
}): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    material: row.material,
    price: row.price,
    category: row.category,
    type: row.type,
    print: row.print,
    inventory: row.inventory,
    featured: row.featured,
    swatch: row.swatch,
    pattern: (row.pattern as Product["pattern"]) ?? "cross",
    details: asStringArray(row.details),
    shipping: asStringArray(row.shipping),
    sizes: asStringArray(row.sizes),
    colors: asTypedArray<Product["colors"][number]>(row.colors),
    views: asTypedArray<Product["views"][number]>(row.views)
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!hasDatabaseUrl()) {
    return mockProducts;
  }

  try {
    const data = await prisma.product.findMany({
      orderBy: {
        createdAt: "asc"
      }
    });

    return data.map((row) => mapProductRow(row));
  } catch (error) {
    console.error("Failed to fetch products via Prisma:", error);
    return mockProducts;
  }
});

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured).slice(0, 4);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!hasDatabaseUrl()) {
    return mockMetrics;
  }

  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  return {
    revenue: orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.amount, 0),
    orderCount: orders.length,
    inventoryUnits: products.reduce((sum, product) => sum + product.inventory, 0),
    lowStockCount: products.filter((product) => product.inventory <= 8).length
  };
}

export async function getOrders(): Promise<OrderRecord[]> {
  if (!hasDatabaseUrl()) {
    return mockOrders;
  }

  try {
    const data = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return data.map((order) => ({
      id: order.id,
      customer_email: order.customerEmail,
      customer_name: order.customerName,
      customer_phone: order.customerPhone ?? undefined,
      delivery_address: order.deliveryAddress ?? undefined,
      delivery_city: order.deliveryCity ?? undefined,
      delivery_state: order.deliveryState ?? undefined,
      delivery_country: order.deliveryCountry ?? undefined,
      delivery_notes: order.deliveryNotes ?? undefined,
      amount: order.amount,
      status: order.status,
      paystack_reference: order.paystackReference ?? undefined,
      created_at: order.createdAt.toISOString(),
      items: Array.isArray(order.items) ? (order.items as unknown as OrderRecord["items"]) : []
    }));
  } catch (error) {
    console.error("Failed to fetch orders via Prisma:", error);
    return mockOrders;
  }
}

const defaultStoreSettings: StoreSettings = {
  usdRate: 1600
};

export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  if (!hasDatabaseUrl()) {
    return defaultStoreSettings;
  }

  try {
    const settings = await prisma.storeSettings.findUnique({
      where: {
        id: "default"
      }
    });

    if (!settings) {
      return defaultStoreSettings;
    }

    return {
      usdRate: settings.usdRate
    };
  } catch (error) {
    console.error("Failed to fetch store settings via Prisma:", error);
    return defaultStoreSettings;
  }
});
