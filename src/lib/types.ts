export type ProductOption = { name: string; values: string[] };

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  brand: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  low_stock_threshold: number;
  weight_grams: number;
  images: string[];
  options: ProductOption[];
  tags: string[];
  status: string;
  is_featured: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  created_at?: string;
};

export type ProductWithCategory = Product & { category_name: string | null };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export const discountPercent = (p: { price: number; compare_at_price: number | null }) =>
  p.compare_at_price && p.compare_at_price > p.price
    ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)
    : 0;
