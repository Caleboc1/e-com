import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/store/product-detail-client";
import { getProductBySlug } from "@/lib/store";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
