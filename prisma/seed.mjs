import bcrypt from "bcryptjs";
import { PrismaClient, ProductCategory, ProductPrint, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "the-oyinkan-tee",
    name: "The Oyinkan Tee",
    description:
      "A softly structured linen tee for warm days and quiet confidence. Designed to sit easy on the body and layer across seasons.",
    material: "100% Linen · Natural",
    price: 18500,
    category: ProductCategory.women,
    type: "t-shirt",
    print: ProductPrint.plain,
    inventory: 18,
    featured: true,
    swatch: "linear-gradient(160deg, #DDD4C4 0%, #C9BFAD 60%, #BEB3A0 100%)",
    pattern: "cross",
    details: [
      "Pure linen with a soft washed hand-feel",
      "Relaxed fit with slightly dropped shoulders",
      "Designed in Lagos and finished locally",
      "Model is 5'8\" and wears size S"
    ],
    shipping: [
      "Free shipping within Nigeria on orders over ₦150,000",
      "Standard delivery in 3–5 working days",
      "14-day returns on unworn pieces"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { id: "natural", name: "Natural", swatchColor: "#D8CFBE", pattern: "cross" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#D8CFBE", pattern: "cross" }
    ]
  },
  {
    slug: "adire-slip-dress",
    name: "Adire Slip Dress",
    description:
      "A relaxed bias-cut slip in our signature Adire print. Lightweight cotton that breathes, falls softly, and softens further with every wear.",
    material: "Cotton · Burnt Earth",
    price: 42000,
    category: ProductCategory.women,
    type: "dress",
    print: ProductPrint.adire,
    inventory: 9,
    featured: true,
    swatch: "#8B3A2A",
    pattern: "hex",
    details: [
      "100% cotton, hand-dyed using traditional Adire techniques",
      "Adjustable straps",
      "Side seam pockets",
      "Designed in Lagos · Hand-dyed in Abeokuta"
    ],
    shipping: [
      "Free shipping within Nigeria on orders over ₦150,000",
      "International shipping available at checkout",
      "14-day returns on unworn items with tags attached"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { id: "burnt-earth", name: "Burnt Earth", swatchColor: "#8B3A2A", pattern: "hex" },
      { id: "indigo-night", name: "Indigo Night", swatchColor: "#1E2E52", pattern: "circle" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#8B3A2A", pattern: "hex" }
    ]
  }
];

async function main() {
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: { usdRate: 1600, ghsRate: 100, usdMarkupPercent: 0 },
    create: { id: "default", usdRate: 1600, ghsRate: 100, usdMarkupPercent: 0 }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
      update: {
        name: "Store Admin",
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      },
      create: {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        name: "Store Admin",
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      }
    });
  }

  await prisma.order.upsert({
    where: { paystackReference: "SAIIA_001" },
    update: {},
    create: {
      customerEmail: "ada@example.com",
      customerName: "Ada N.",
      amount: 79000,
      status: OrderStatus.paid,
      paystackReference: "SAIIA_001",
      items: [
        {
          product_id: "seed-product",
          name: "Adire Slip Dress",
          quantity: 1,
          unit_price: 42000,
          size: "M",
          color: "Burnt Earth"
        }
      ]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
