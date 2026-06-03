import { redirect } from "next/navigation";

import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { StoreSettingsForm } from "@/components/admin/store-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/lib/auth";
import { getDashboardMetrics, getOrders, getProducts, getStoreSettings, getSubscribers } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [metrics, products, orders, storeSettings, subscribers] = await Promise.all([
    getDashboardMetrics(),
    getProducts(),
    getOrders(),
    getStoreSettings(),
    getSubscribers()
  ]);

  return (
    <div className="min-h-screen bg-[#f7f3eb] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-[1400px] space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-tag">Admin Dashboard</span>
            <h1 className="font-display text-5xl font-light">Store Operations</h1>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-text-muted">
              Manage products, pricing, stock, and orders from the same SAIIA visual system as the storefront, with Prisma handling the database layer.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">{session.user.email}</span>
            <SignOutButton />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Revenue", formatPrice(metrics.revenue)],
            ["Orders", String(metrics.orderCount)],
            ["Inventory Units", String(metrics.inventoryUnits)],
            ["Low Stock", String(metrics.lowStockCount)]
          ].map(([label, value]) => (
            <Card key={label}>
              <CardHeader className="pb-3">
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-clay-dark">{label}</span>
              </CardHeader>
              <CardContent>
                <p className="font-display text-4xl font-light">{value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Store Currency</CardTitle>
            </CardHeader>
            <CardContent>
              <StoreSettingsForm settings={storeSettings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New / Update Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductEditorForm />
            </CardContent>
          </Card>
        </section>

        <AdminDashboardClient products={products} orders={orders} subscribers={subscribers} />
      </div>
    </div>
  );
}
