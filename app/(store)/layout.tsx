import { StorefrontProvider } from "@/components/store/storefront-provider";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getStoreSettings } from "@/lib/store";
import { getPreferredCurrency } from "@/lib/storefront";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, currency] = await Promise.all([getStoreSettings(), getPreferredCurrency()]);

  return (
    <StorefrontProvider currency={currency} settings={settings}>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <CartDrawer />
    </StorefrontProvider>
  );
}
