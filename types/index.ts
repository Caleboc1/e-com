export type ProductCategory = "women" | "men" | "kids";
export type ProductPrint = "adire" | "plain";
export type PatternVariant = "circle" | "hex" | "grid" | "cross";

export interface ProductColor {
  id: string;
  name: string;
  swatchColor: string;
  pattern: PatternVariant;
}

export interface ProductView {
  id: string;
  label: string;
  swatchColor: string;
  pattern: PatternVariant;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  material: string;
  price: number;
  category: ProductCategory;
  type: string;
  print: ProductPrint;
  inventory: number;
  featured?: boolean;
  swatch: string;
  pattern: PatternVariant;
  details: string[];
  shipping: string[];
  sizes: string[];
  colors: ProductColor[];
  views: ProductView[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  swatch: string;
  pattern: PatternVariant;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  size: string;
  color: string;
}

export interface DeliveryDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_country?: string;
  delivery_notes?: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  paystack_reference?: string;
  created_at: string;
  items: OrderItem[];
}

export interface DashboardMetrics {
  revenue: number;
  orderCount: number;
  inventoryUnits: number;
  lowStockCount: number;
}

export type StoreCurrency = "NGN" | "USD";

export interface StoreSettings {
  usdRate: number;
}

export interface ActionResult {
  status: "idle" | "success" | "error";
  message?: string;
  timestamp?: number;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  created_at: string;
}
