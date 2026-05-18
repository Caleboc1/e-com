"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/store/cart-provider";
import { buttonVariants } from "@/components/ui/button";

export function ThankYouClient({ reference }: { reference?: string }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(countdown);
          router.push("/");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center md:px-12">
      <span className="section-tag">Payment Successful</span>
      <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-light leading-none">
        Thanks for
        <br />
        your patronage.
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-8 text-text-muted">
        Your order has been received successfully. We&apos;ll begin processing it right away.
      </p>
      {reference ? (
        <p className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-clay-dark">Reference: {reference}</p>
      ) : null}
      <p className="mt-4 text-sm text-earth">Returning to the home page in {secondsLeft} seconds.</p>
      <Link href="/" className={`${buttonVariants()} mt-8 inline-flex`}>
        Return Home Now
      </Link>
    </div>
  );
}
