import { NextResponse } from "next/server";
import { OrderStatus, type Prisma } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";
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

  const amount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const reference = `SAIIA_${Date.now()}`;
  const orderItems: OrderItem[] = body.items.map((item) => ({
    product_id: item.productId,
    name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    size: item.size,
    color: item.color
  }));

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
      amount: amount * 100,
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
