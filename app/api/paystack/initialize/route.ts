import { NextResponse } from "next/server";
import { OrderStatus, type Prisma } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/store";
import { getCurrencyForCountry } from "@/lib/storefront";
import { getDeliveryFee, getPaystackAmountInSubunits } from "@/lib/utils";
import type { CartItem, DeliveryDetails, OrderItem } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    delivery?: Partial<DeliveryDetails>;
    items?: CartItem[];
  };

  const delivery = body.delivery;

  if (
    !delivery?.email ||
    !delivery?.name ||
    !delivery?.phone ||
    !delivery?.address ||
    !delivery?.city ||
    !delivery?.state ||
    !delivery?.country ||
    !body.items?.length
  ) {
    return NextResponse.json({ error: "Missing checkout details." }, { status: 400 });
  }

  const cartItems = body.items.filter((item) => Number.isInteger(item.quantity) && item.quantity > 0);

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const settings = await getStoreSettings();
  const currency = getCurrencyForCountry(delivery.country);
  const productIds = [...new Set(cartItems.map((item) => item.productId))];
  const products = hasDatabaseUrl()
    ? await prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        },
        select: {
          id: true,
          name: true,
          price: true
        }
      })
    : [];
  const productMap = new Map(products.map((product) => [product.id, product]));

  if (hasDatabaseUrl() && productMap.size !== productIds.length) {
    return NextResponse.json({ error: "Some cart items are no longer available." }, { status: 400 });
  }

  const itemsTotal = cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product?.price ?? item.price) * item.quantity;
  }, 0);
  const deliveryFee = getDeliveryFee(delivery.country, delivery.state, settings);
  const amount = itemsTotal + deliveryFee;
  const chargedAmount = getPaystackAmountInSubunits(amount, currency, settings);
  const reference = `SAIIA_${Date.now()}`;
  const orderItems: OrderItem[] = cartItems.map((item) => {
    const product = productMap.get(item.productId);
    const unitPrice = product?.price ?? item.price;

    return {
      product_id: item.productId,
      name: product?.name ?? item.name,
      quantity: item.quantity,
      unit_price: unitPrice,
      charged_unit_price: getPaystackAmountInSubunits(unitPrice, currency, settings),
      size: item.size,
      color: item.color
    };
  });

  if (hasDatabaseUrl()) {
    await prisma.order.create({
      data: {
        customerEmail: delivery.email,
        customerName: delivery.name,
        customerPhone: delivery.phone,
        deliveryAddress: delivery.address,
        deliveryCity: delivery.city,
        deliveryState: delivery.state,
        deliveryCountry: delivery.country,
        deliveryNotes: delivery.notes ?? "",
        amount,
        currency,
        chargedAmount,
        status: OrderStatus.pending,
        paystackReference: reference,
        items: orderItems as unknown as Prisma.InputJsonValue
      }
    });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({
      authorization_url: `/admin?paystack=missing&reference=${reference}`,
      reference
    });
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: delivery.email,
      amount: chargedAmount,
      currency,
      reference,
      callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/verify?reference=${reference}`,
      metadata: {
        customer_name: delivery.name,
        customer_phone: delivery.phone,
        delivery_address: delivery.address,
        delivery_city: delivery.city,
        delivery_state: delivery.state,
        delivery_country: delivery.country,
        delivery_notes: delivery.notes ?? "",
        items: orderItems
      }
    })
  });

  const payload = (await response.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; reference: string };
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    return NextResponse.json({ error: payload.message ?? "Paystack initialize failed." }, { status: 500 });
  }

  return NextResponse.json(payload.data);
}
