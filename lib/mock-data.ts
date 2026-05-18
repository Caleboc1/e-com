import type { DashboardMetrics, OrderRecord, Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "p001",
    slug: "the-oyinkan-tee",
    name: "The Oyinkan Tee",
    description:
      "A softly structured linen tee for warm days and quiet confidence. Designed to sit easy on the body and layer across seasons.",
    material: "100% Linen · Natural",
    price: 18500,
    category: "women",
    type: "t-shirt",
    print: "plain",
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
      { id: "natural", name: "Natural", swatchColor: "#D8CFBE", pattern: "cross" },
      { id: "faded-rose", name: "Faded Rose", swatchColor: "#8B4A55", pattern: "circle" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#D8CFBE", pattern: "cross" },
      { id: "back", label: "Back", swatchColor: "#C4B59F", pattern: "cross" },
      { id: "detail", label: "Detail", swatchColor: "#BEB3A0", pattern: "cross" }
    ]
  },
  {
    id: "p002",
    slug: "adire-slip-dress",
    name: "Adire Slip Dress",
    description:
      "A relaxed bias-cut slip in our signature Adire print. Lightweight cotton that breathes, falls softly, and softens further with every wear.",
    material: "Cotton · Burnt Earth",
    price: 42000,
    category: "women",
    type: "dress",
    print: "adire",
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
      { id: "indigo-night", name: "Indigo Night", swatchColor: "#1E2E52", pattern: "circle" },
      { id: "forest-dusk", name: "Forest Dusk", swatchColor: "#2A4A2E", pattern: "grid" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#8B3A2A", pattern: "hex" },
      { id: "back", label: "Back", swatchColor: "#7A3225", pattern: "hex" },
      { id: "detail", label: "Detail", swatchColor: "#6E2C20", pattern: "hex" },
      { id: "worn", label: "Worn", swatchColor: "#9A4233", pattern: "hex" }
    ]
  },
  {
    id: "p003",
    slug: "wide-leg-trousers",
    name: "Wide Leg Trousers",
    description:
      "Fluid linen-blend trousers with clean lines, a forgiving waist, and enough structure to dress up or down.",
    material: "Linen Blend · Sand",
    price: 32000,
    category: "women",
    type: "trousers",
    print: "plain",
    inventory: 12,
    featured: true,
    swatch: "linear-gradient(160deg, #E8DCCB 0%, #D4C4AE 100%)",
    pattern: "cross",
    details: [
      "Linen-cotton blend",
      "Elasticated back waist",
      "Wide full-length leg",
      "Designed for Lagos heat and movement"
    ],
    shipping: [
      "Standard delivery in 3–5 working days",
      "Returns accepted within 14 days"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { id: "sand", name: "Sand", swatchColor: "#D4C4AE", pattern: "cross" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#D4C4AE", pattern: "cross" },
      { id: "detail", label: "Detail", swatchColor: "#C6B49B", pattern: "cross" }
    ]
  },
  {
    id: "p004",
    slug: "the-eko-shirt",
    name: "The Eko Shirt",
    description:
      "A crisp short-sleeve cotton shirt cut for relaxed structure and daily wear.",
    material: "100% Cotton · Onyx",
    price: 22000,
    category: "men",
    type: "shirt",
    print: "plain",
    inventory: 20,
    featured: true,
    swatch: "linear-gradient(160deg, #3A3A3A 0%, #2A2A28 100%)",
    pattern: "cross",
    details: [
      "Midweight cotton poplin",
      "Boxy fit and straight hem",
      "Made to be worn tucked or loose"
    ],
    shipping: [
      "Standard delivery in 3–5 working days",
      "Returns accepted within 14 days"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { id: "onyx", name: "Onyx", swatchColor: "#2A2A28", pattern: "cross" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#2A2A28", pattern: "cross" },
      { id: "back", label: "Back", swatchColor: "#3A3A3A", pattern: "cross" }
    ]
  },
  {
    id: "p005",
    slug: "adire-tee-indigo",
    name: "Adire Tee — Indigo",
    description:
      "An everyday tee reworked with a deep indigo Adire colourway and a roomy fit.",
    material: "100% Cotton · Indigo",
    price: 24000,
    category: "men",
    type: "t-shirt",
    print: "adire",
    inventory: 7,
    swatch: "#1E2E52",
    pattern: "circle",
    details: [
      "Soft breathable cotton jersey",
      "Hand-dyed Indigo Night colourway",
      "Relaxed unisex silhouette"
    ],
    shipping: [
      "Standard delivery in 3–5 working days",
      "International shipping available"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { id: "indigo-night", name: "Indigo Night", swatchColor: "#1E2E52", pattern: "circle" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#1E2E52", pattern: "circle" },
      { id: "detail", label: "Detail", swatchColor: "#24345A", pattern: "circle" }
    ]
  },
  {
    id: "p006",
    slug: "mini-adire-tee",
    name: "Mini Adire Tee",
    description:
      "A play-ready kids tee in warm saffron with a cheerful Adire motif.",
    material: "Cotton · Saffron",
    price: 12000,
    category: "kids",
    type: "t-shirt",
    print: "adire",
    inventory: 15,
    swatch: "#9A6B10",
    pattern: "hex",
    details: [
      "Soft combed cotton",
      "Easy fit for movement",
      "Hand-dyed finish"
    ],
    shipping: [
      "Standard delivery in 3–5 working days"
    ],
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [
      { id: "saffron-sun", name: "Saffron Sun", swatchColor: "#9A6B10", pattern: "hex" }
    ],
    views: [
      { id: "front", label: "Front", swatchColor: "#9A6B10", pattern: "hex" }
    ]
  }
];

export const mockOrders: OrderRecord[] = [
  {
    id: "ord_001",
    customer_email: "ada@example.com",
    customer_name: "Ada N.",
    customer_phone: "+2348012345678",
    delivery_address: "12 Allen Avenue, Ikeja",
    delivery_city: "Lagos",
    delivery_state: "Lagos",
    delivery_country: "Nigeria",
    delivery_notes: "Call on arrival.",
    amount: 79000,
    status: "paid",
    paystack_reference: "SAIIA_001",
    created_at: "2026-05-16T10:30:00.000Z",
    items: [
      {
        product_id: "p002",
        name: "Adire Slip Dress",
        quantity: 1,
        unit_price: 42000,
        size: "M",
        color: "Burnt Earth"
      },
      {
        product_id: "p001",
        name: "The Oyinkan Tee",
        quantity: 2,
        unit_price: 18500,
        size: "S",
        color: "Natural"
      }
    ]
  },
  {
    id: "ord_002",
    customer_email: "timi@example.com",
    customer_name: "Timi A.",
    customer_phone: "+2348098765432",
    delivery_address: "5 Admiralty Way, Lekki Phase 1",
    delivery_city: "Lagos",
    delivery_state: "Lagos",
    delivery_country: "Nigeria",
    amount: 24000,
    status: "paid",
    paystack_reference: "SAIIA_002",
    created_at: "2026-05-17T13:00:00.000Z",
    items: [
      {
        product_id: "p005",
        name: "Adire Tee — Indigo",
        quantity: 1,
        unit_price: 24000,
        size: "L",
        color: "Indigo Night"
      }
    ]
  }
];

export const mockMetrics: DashboardMetrics = {
  revenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
  orderCount: mockOrders.length,
  inventoryUnits: mockProducts.reduce((sum, product) => sum + product.inventory, 0),
  lowStockCount: mockProducts.filter((product) => product.inventory <= 8).length
};
