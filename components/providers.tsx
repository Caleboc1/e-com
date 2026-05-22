"use client";

import { SessionProvider } from "next-auth/react";

import { CartProvider } from "@/components/store/cart-provider";
import { ToasterProvider } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToasterProvider>
        <CartProvider>{children}</CartProvider>
      </ToasterProvider>
    </SessionProvider>
  );
}
