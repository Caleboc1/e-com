import { ThankYouClient } from "@/components/store/thank-you-client";

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;

  return <ThankYouClient reference={params.reference} />;
}
