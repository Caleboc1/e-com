"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { AdminModal } from "@/components/admin/admin-modal";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteProductAction } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import type { OrderRecord, Product } from "@/types";

type ProductModalState =
  | { mode: "view"; product: Product }
  | { mode: "edit"; product: Product }
  | null;

export function AdminDashboardClient({
  products,
  orders
}: {
  products: Product[];
  orders: OrderRecord[];
}) {
  const [productModal, setProductModal] = useState<ProductModalState>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  return (
    <>
      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <ProductListCard
          products={products}
          onView={(product) => setProductModal({ mode: "view", product })}
          onEdit={(product) => setProductModal({ mode: "edit", product })}
        />

        <div className="space-y-8">
          <OrderListCard orders={orders} onView={setSelectedOrder} />
        </div>
      </section>

      <ProductModal state={productModal} onClose={() => setProductModal(null)} />
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}

function ProductListCard({
  products,
  onView,
  onEdit
}: {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}) {
  return (
    <div className="border border-linen-dark bg-white">
      <div className="border-b border-linen-dark px-6 py-5">
        <h2 className="font-display text-3xl font-light">Products</h2>
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.inventory}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <IconButton label="View" onClick={() => onView(product)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Edit" onClick={() => onEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <IconButton
                        label="Delete"
                        variant="danger"
                        onClick={(event) => {
                          if (!window.confirm(`Delete "${product.name}"?`)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function OrderListCard({
  orders,
  onView
}: {
  orders: OrderRecord[];
  onView: (order: OrderRecord) => void;
}) {
  return (
    <div className="border border-linen-dark bg-white">
      <div className="border-b border-linen-dark px-6 py-5">
        <h2 className="font-display text-3xl font-light">Recent Orders</h2>
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-text-muted">{order.customer_email}</div>
                </TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell>{formatPrice(order.amount)}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString("en-NG")}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <IconButton label="View" onClick={() => onView(order)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductModal({
  state,
  onClose
}: {
  state: ProductModalState;
  onClose: () => void;
}) {
  if (!state) {
    return null;
  }

  if (state.mode === "edit") {
    return (
      <AdminModal open title={`Edit ${state.product.name}`} description="Update the product details and save changes." onClose={onClose} size="xl">
        <ProductEditorForm initialProduct={state.product} submitLabel="Update Product" onCancel={onClose} />
      </AdminModal>
    );
  }

  const product = state.product;

  return (
    <AdminModal open title={product.name} description="Product details" onClose={onClose} size="lg">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {product.views.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {product.views.map((view) => (
                <div key={view.id} className="overflow-hidden border border-linen-dark bg-linen">
                  {view.imageUrl ? (
                    <img src={view.imageUrl} alt={`${product.name} ${view.label}`} className="aspect-[3/4] w-full object-cover" />
                  ) : (
                    <div className="aspect-[3/4] w-full" style={{ background: view.swatchColor }} />
                  )}
                  <div className="border-t border-linen-dark px-4 py-3 text-xs uppercase tracking-[0.16em] text-clay-dark">
                    {view.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Category" value={product.category} />
            <Detail label="Type" value={product.type} />
            <Detail label="Print" value={product.print} />
            <Detail label="Inventory" value={String(product.inventory)} />
            <Detail label="Price" value={formatPrice(product.price)} />
            <Detail label="Featured" value={product.featured ? "Yes" : "No"} />
          </div>

          <div>
            <p className="section-tag mb-2">Description</p>
            <p className="text-sm leading-7 text-text-muted">{product.description}</p>
          </div>

          <div>
            <p className="section-tag mb-2">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span key={size} className="border border-clay px-3 py-2 text-xs uppercase tracking-[0.12em] text-earth">
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="section-tag mb-2">Colours</p>
            <div className="space-y-3">
              {product.colors.map((color) => (
                <div key={color.id} className="flex items-center gap-3">
                  <span className="h-5 w-5 border border-charcoal/10" style={{ background: color.swatchColor }} />
                  <span className="text-sm text-charcoal">{color.name}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-text-muted">{color.swatchColor}</span>
                </div>
              ))}
            </div>
          </div>

          <ListBlock title="Details & Fit" items={product.details} />
          <ListBlock title="Shipping & Returns" items={product.shipping} />
        </div>
      </div>
    </AdminModal>
  );
}

function OrderModal({
  order,
  onClose
}: {
  order: OrderRecord | null;
  onClose: () => void;
}) {
  if (!order) {
    return null;
  }

  return (
    <AdminModal
      open
      title={`Order ${order.id.slice(0, 8)}`}
      description={`Placed on ${new Date(order.created_at).toLocaleDateString("en-NG")}`}
      onClose={onClose}
      size="lg"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          <Detail label="Customer" value={order.customer_name} />
          <Detail label="Email" value={order.customer_email} />
          <Detail label="Phone" value={order.customer_phone ?? "Not provided"} />
          <Detail label="Status" value={order.status} />
          <Detail label="Amount" value={formatPrice(order.amount)} />
          <Detail label="Reference" value={order.paystack_reference ?? "Pending"} />
          <Detail
            label="Delivery Address"
            value={[
              order.delivery_address,
              order.delivery_city,
              order.delivery_state,
              order.delivery_country
            ]
              .filter(Boolean)
              .join(", ") || "Not provided"}
          />
          <Detail label="Delivery Notes" value={order.delivery_notes ?? "None"} />
        </div>

        <div>
          <p className="section-tag mb-3">Items</p>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.product_id}-${index}`} className="border border-linen-dark bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-light">{item.name}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      Size {item.size} · {item.color}
                    </p>
                  </div>
                  <div className="text-right text-sm text-earth">
                    <div>{item.quantity} pcs</div>
                    <div>{formatPrice(item.unit_price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-clay-dark">{label}</p>
      <p className="mt-2 text-sm text-charcoal">{value}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="section-tag mb-2">{title}</p>
      <ul className="space-y-2 text-sm leading-7 text-text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  variant = "default"
}: {
  children: React.ReactNode;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center border transition-colors ${
        variant === "danger"
          ? "border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50"
          : "border-clay text-earth hover:border-charcoal hover:text-charcoal"
      }`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
