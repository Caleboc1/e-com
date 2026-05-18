import { CheckoutClient } from "@/components/store/checkout-client";

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const params = await searchParams;

  return <CheckoutClient paymentState={params.payment} />;
}
