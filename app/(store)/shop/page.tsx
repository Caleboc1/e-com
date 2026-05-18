import { ShopClient } from "@/components/store/shop-client";
import { getProducts } from "@/lib/store";

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; print?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();

  return <ShopClient products={products} initialCategory={params.category} initialPrint={params.print} />;
}
