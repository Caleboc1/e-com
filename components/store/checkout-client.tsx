"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/store/cart-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStorefront } from "@/components/store/storefront-provider";
import type { DeliveryDetails } from "@/types";

const DELIVERY_STORAGE_KEY = "saiia-delivery-details";

const emptyDetails: DeliveryDetails = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
  notes: ""
};

export function CheckoutClient({ paymentState }: { paymentState?: string }) {
  const { items, subtotal } = useCart();
  const { currency, formatStorePrice } = useStorefront();
  const [details, setDetails] = useState<DeliveryDetails>(emptyDetails);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    paymentState === "failed" ? "Payment was not completed. Review your details and try again." : null
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(DELIVERY_STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as DeliveryDetails;
      setDetails({
        ...emptyDetails,
        ...parsed
      });
      setDetailsSaved(true);
    } catch {
      window.localStorage.removeItem(DELIVERY_STORAGE_KEY);
    }
  }, []);

  const shippingMessage = useMemo(() => {
    if (subtotal >= 150000) {
      return "You qualify for free shipping.";
    }

    return `Add ${formatStorePrice(150000 - subtotal)} for free shipping.`;
  }, [formatStorePrice, subtotal]);

  function updateField<K extends keyof DeliveryDetails>(key: K, value: DeliveryDetails[K]) {
    setDetails((current) => ({
      ...current,
      [key]: value
    }));
    setDetailsSaved(false);
  }

  function saveDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(details));
    setDetailsSaved(true);
    setErrorMessage(null);
  }

  async function proceedToPayment() {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          delivery: details,
          items
        })
      });

      const payload = (await response.json()) as { authorization_url?: string; error?: string };

      if (!response.ok || !payload.authorization_url) {
        setErrorMessage(payload.error ?? "Payment could not be initialized.");
        return;
      }

      window.location.href = payload.authorization_url;
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center md:px-12">
        <span className="section-tag">Checkout</span>
        <h1 className="font-display text-5xl font-light">Your bag is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-text-muted">
          Add a few pieces before proceeding to checkout.
        </p>
        <Link href="/shop" className={`${buttonVariants()} mt-8 inline-flex`}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
      <div className="mb-10">
        <span className="section-tag">Checkout</span>
        <h1 className="font-display text-[clamp(2.8rem,5vw,4.5rem)] font-light leading-none">
          Delivery details before
          <br />
          payment.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-text-muted">
          Enter the customer&apos;s delivery details first. After saving them, the payment option will appear.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={saveDetails} className="space-y-6 border border-linen-dark bg-white p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={details.name} onChange={(value) => updateField("name", value)} />
            <Field label="Email Address" type="email" value={details.email} onChange={(value) => updateField("email", value)} />
            <Field label="Phone Number" value={details.phone} onChange={(value) => updateField("phone", value)} />
            <Field label="Country" value={details.country} onChange={(value) => updateField("country", value)} />
            <Field label="City" value={details.city} onChange={(value) => updateField("city", value)} />
            <Field label="State / Region" value={details.state} onChange={(value) => updateField("state", value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              required
              value={details.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes</Label>
            <Textarea
              id="notes"
              value={details.notes ?? ""}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Apartment, landmark, gate code, preferred contact notes..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save Delivery Details</Button>
            {detailsSaved ? (
              <Button type="button" variant="outline" onClick={() => setDetailsSaved(false)}>
                Edit Details
              </Button>
            ) : null}
          </div>

          {detailsSaved ? (
            <p className="text-sm text-earth">Delivery details saved. You can proceed to payment now.</p>
          ) : null}
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
        </form>

        <aside className="space-y-6 border border-linen-dark bg-[#fbf8f1] p-6 md:p-8">
          <div>
            <p className="section-tag mb-2">Order Summary</p>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 border-b border-linen-dark pb-4">
                  <div>
                    <p className="font-display text-2xl font-light">{item.name}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-earth">{formatStorePrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-linen-dark pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="uppercase tracking-[0.18em] text-clay-dark">Subtotal</span>
              <span className="text-earth">{formatStorePrice(subtotal)}</span>
            </div>
            <p className="text-sm text-text-muted">{shippingMessage}</p>
            {currency !== "NGN" ? (
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
                Prices are shown in {currency}. Paystack will charge {currency}.
              </p>
            ) : null}
          </div>

          <Button className="w-full" disabled={!detailsSaved || isSubmitting} onClick={proceedToPayment}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Proceed to Payment"}
          </Button>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
