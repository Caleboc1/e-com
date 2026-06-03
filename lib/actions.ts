"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { ProductCategory, ProductPrint } from "@prisma/client";
import { z } from "zod";

import { getAdminSession } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/types";

const idleResult: ActionResult = {
  status: "idle"
};

function actionSuccess(message: string): ActionResult {
  return {
    status: "success",
    message,
    timestamp: Date.now()
  };
}

function actionError(message: string): ActionResult {
  return {
    status: "error",
    message,
    timestamp: Date.now()
  };
}

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.")
});

async function saveUploadedFile(file: File, prefix: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || ".jpg";
  const safeName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), bytes);

  return `/uploads/products/${safeName}`;
}

function getDefaultPattern(print: ProductPrint) {
  return print === ProductPrint.adire ? "hex" : "cross";
}

export async function upsertProductAction(previousState: ActionResult = idleResult, formData: FormData): Promise<ActionResult> {
  void previousState;
  const session = await getAdminSession();

  if (!session) {
    return actionError("You need to sign in again to manage products.");
  }

  if (!hasDatabaseUrl()) {
    return actionError("Database connection is not configured.");
  }

  const productId = String(formData.get("productId") ?? "").trim();
  const print = String(formData.get("print") ?? "plain") as ProductPrint;
  const pattern = getDefaultPattern(print);
  const sizes = formData
    .getAll("sizes")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const colorNames = formData.getAll("colorName");
  const colorSwatches = formData.getAll("colorSwatch");
  const colors = colorNames
    .map((value, index) => {
      const name = String(value).trim();
      const swatchColor = String(colorSwatches[index] ?? "").trim();

      if (!name) {
        return null;
      }

      return {
        id: slugify(name),
        name,
        swatchColor: swatchColor || "#D8CFBE",
        pattern
      };
    })
    .filter((color): color is { id: string; name: string; swatchColor: string; pattern: string } => Boolean(color));
  const viewLabels = formData.getAll("viewLabel");
  const viewImages = formData.getAll("viewImage");
  const existingViewImageUrls = formData.getAll("existingViewImageUrl");
  const firstSwatch = colors[0]?.swatchColor ?? "#D8CFBE";
  const views = (
    await Promise.all(
      viewLabels.map(async (value, index) => {
        const label = String(value).trim();
        const image = viewImages[index];
        const existingImageUrl = String(existingViewImageUrls[index] ?? "").trim();

        if (!label) {
          return null;
        }

        const imageUrl =
          image instanceof File && image.size > 0
            ? await saveUploadedFile(image, `${slugify(label)}-${Date.now()}`)
            : existingImageUrl || null;

        return {
          id: slugify(label),
          label,
          swatchColor: firstSwatch,
          pattern,
          ...(imageUrl ? { imageUrl } : {})
        };
      })
    )
  ).filter(
    (view): view is { id: string; label: string; swatchColor: string; pattern: string; imageUrl?: string } =>
      Boolean(view)
  );

  const normalizedSizes = sizes.length > 0 ? sizes : ["One Size"];
  const normalizedColors = colors.length > 0 ? colors : [{ id: "default", name: "Default", swatchColor: "#D8CFBE", pattern }];
  const primaryColor = normalizedColors[0] ?? { id: "default", name: "Default", swatchColor: "#D8CFBE", pattern };
  const normalizedViews =
    views.length > 0
      ? views
      : [
          {
            id: "front",
            label: "Front",
            swatchColor: primaryColor.swatchColor,
            pattern
          }
        ];

  const product = {
    slug: slugify(String(formData.get("name") ?? "")),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    material: String(formData.get("material") ?? ""),
    price: Number(formData.get("price") ?? 0),
    category: String(formData.get("category") ?? "women") as ProductCategory,
    type: String(formData.get("type") ?? "piece"),
    print,
    inventory: Number(formData.get("inventory") ?? 0),
    featured: formData.get("featured") === "on",
    swatch: primaryColor.swatchColor,
    pattern,
    details: String(formData.get("details") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    shipping: String(formData.get("shipping") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    sizes: normalizedSizes,
    colors: normalizedColors,
    views: normalizedViews
  };

  let previousSlug: string | null = null;

  if (productId) {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId
      },
      select: {
        slug: true
      }
    });

    previousSlug = existingProduct?.slug ?? null;

    await prisma.product.update({
      where: {
        id: productId
      },
      data: product
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin");
    revalidatePath(`/product/${product.slug}`);

    if (previousSlug && previousSlug !== product.slug) {
      revalidatePath(`/product/${previousSlug}`);
    }

    return actionSuccess(`Updated ${product.name}.`);
  } else {
    await prisma.product.upsert({
      where: {
        slug: product.slug
      },
      update: product,
      create: product
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin");
    revalidatePath(`/product/${product.slug}`);

    return actionSuccess(`Added ${product.name} to the store.`);
  }
}

export async function deleteProductAction(previousState: ActionResult = idleResult, formData: FormData): Promise<ActionResult> {
  void previousState;
  const session = await getAdminSession();

  if (!session || !hasDatabaseUrl()) {
    return actionError("Unable to connect to the database right now.");
  }

  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    return actionError("Missing product id.");
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId
    },
    select: {
      slug: true
    }
  });

  await prisma.product.delete({
    where: {
      id: productId
    }
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");

  if (existingProduct?.slug) {
    revalidatePath(`/product/${existingProduct.slug}`);
  }

  return actionSuccess(`Deleted ${existingProduct?.slug ?? "product"}.`);
}

export async function updateStoreSettingsAction(
  previousState: ActionResult = idleResult,
  formData: FormData
): Promise<ActionResult> {
  void previousState;
  const session = await getAdminSession();

  if (!session || !hasDatabaseUrl()) {
    return actionError("Unable to connect to the database right now.");
  }

  const usdRate = Number(formData.get("usdRate") ?? 0);
  const ghsRate = Number(formData.get("ghsRate") ?? 0);
  const lagosDeliveryFee = Number(formData.get("lagosDeliveryFee") ?? 0);
  const nigeriaDeliveryFee = Number(formData.get("nigeriaDeliveryFee") ?? 0);
  const internationalDeliveryFee = Number(formData.get("internationalDeliveryFee") ?? 0);

  if (!Number.isFinite(usdRate) || usdRate <= 0) {
    return actionError("Enter a valid USD rate.");
  }

  if (!Number.isFinite(ghsRate) || ghsRate <= 0) {
    return actionError("Enter a valid GHS rate.");
  }

  if (!Number.isFinite(lagosDeliveryFee) || lagosDeliveryFee < 0) {
    return actionError("Enter a valid Lagos delivery fee.");
  }

  if (!Number.isFinite(nigeriaDeliveryFee) || nigeriaDeliveryFee < 0) {
    return actionError("Enter a valid Nigeria delivery fee.");
  }

  if (!Number.isFinite(internationalDeliveryFee) || internationalDeliveryFee < 0) {
    return actionError("Enter a valid international delivery fee.");
  }

  await prisma.storeSettings.upsert({
    where: {
      id: "default"
    },
    update: {
      usdRate,
      ghsRate,
      lagosDeliveryFee,
      nigeriaDeliveryFee,
      internationalDeliveryFee
    },
    create: {
      id: "default",
      usdRate,
      ghsRate,
      lagosDeliveryFee,
      nigeriaDeliveryFee,
      internationalDeliveryFee
    }
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/admin");

  return actionSuccess("Store settings updated.");
}

export async function subscribeAction(previousState: ActionResult = idleResult, formData: FormData): Promise<ActionResult> {
  void previousState;

  if (!hasDatabaseUrl()) {
    return actionError("Newsletter signup is not available right now.");
  }

  const parsed = newsletterSchema.safeParse({
    email: String(formData.get("email") ?? "")
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: {
        email: parsed.data.email
      },
      select: {
        id: true
      }
    });

    if (subscriber) {
      return actionSuccess("This email is already on the list.");
    }

    await prisma.subscriber.create({
      data: {
        email: parsed.data.email
      }
    });

    revalidatePath("/admin");

    return actionSuccess("You are on the list.");
  } catch (error) {
    console.error("Failed to save subscriber:", error);
    return actionError("Could not save your email right now.");
  }
}
