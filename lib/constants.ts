export const NAV_LINKS = [
  { href: "/shop?category=women", label: "Women" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=kids", label: "Kids" },
  { href: "/shop?print=adire", label: "Adire" },
  { href: "/about", label: "About" }
] as const;

export const TICKER_ITEMS = [
  "Free shipping on orders over ₦150,000",
  "100% Natural Fibres",
  "Handcrafted Adire Prints",
  "Sustainably Made in Lagos"
];

export const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "New Arrivals" },
      { href: "/shop?print=adire", label: "Adire Collection" },
      { href: "/shop?type=dress", label: "Easy Dresses" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/about#craft", label: "The Craft" },
      { href: "/about#sustainability", label: "Sustainability" }
    ]
  },
  {
    title: "Help",
    links: [
      { href: "/about#sizing", label: "Sizing Guide" },
      { href: "/about#shipping", label: "Shipping & Returns" },
      { href: "/about#care", label: "Care Instructions" },
      { href: "/about#contact", label: "Contact Us" },
      { href: "/about#faq", label: "FAQ" }
    ]
  }
] as const;
