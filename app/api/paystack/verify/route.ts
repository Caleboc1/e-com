import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import type { OrderRecord } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/shop?payment=missing-reference", request.url));
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.redirect(new URL("/shop?payment=configured-later", request.url));
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as {
    data?: { status?: string };
  };

  if (hasDatabaseUrl()) {
    const status = payload.data?.status === "success" ? OrderStatus.paid : OrderStatus.failed;
    const order = await prisma.order.findUnique({
      where: {
        paystackReference: reference
      }
    });

    await prisma.order.updateMany({
      where: {
        paystackReference: reference
      },
      data: {
        status
      }
    });

    if (status === OrderStatus.paid && order) {
      for (const item of (Array.isArray(order.items) ? order.items : []) as unknown as OrderRecord["items"]) {
        const product = await prisma.product.findUnique({
          where: {
            id: item.product_id
          },
          select: {
            inventory: true
          }
        });

        if (product) {
          await prisma.product.update({
            where: {
              id: item.product_id
            },
            data: {
              inventory: Math.max(0, product.inventory - item.quantity)
            }
          });
        }
      }
    }
  }

  return NextResponse.redirect(
    new URL(payload.data?.status === "success" ? `/thank-you?reference=${reference}` : "/checkout?payment=failed", request.url)
  );
}
