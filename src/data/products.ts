export type Product = {
  id: string;
  name: string;
  category: "Men" | "Women" | "Accessories" | "Sale";
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  isNew: boolean;
  isTrending: boolean;
};

const img = (seed: number) => `https://picsum.photos/seed/velura-${seed}/800/1000`;

const baseSizes = ["S", "M", "L", "XL"];
const palette = ["#1A1A2E", "#E8B86D", "#2D2D2D", "#C0C0C0", "#8B6F47"];

const seed = (i: number): Product => {
  const names = [
    "Cashmere Overcoat", "Silk Blouse", "Tailored Wool Trousers", "Linen Shirt",
    "Leather Crossbody Bag", "Pleated Midi Dress", "Knit Turtleneck", "Suede Loafers",
    "Wool Blend Blazer", "Cotton Poplin Shirt", "Pearl Drop Earrings", "Cashmere Scarf",
    "Velvet Evening Clutch", "Merino Wool Sweater", "Italian Leather Belt", "Silk Slip Dress",
  ];
  const cats: Product["category"][] = ["Men", "Women", "Accessories", "Sale"];
  const price = [129, 89, 159, 79, 219, 189, 99, 249, 299, 69, 149, 119, 179, 139, 89, 209][i];
  const original = Math.round(price * 1.35);
  return {
    id: String(i + 1),
    name: names[i],
    category: cats[i % 4],
    price,
    originalPrice: original,
    discount: Math.round(((original - price) / original) * 100),
    rating: 3.8 + ((i * 0.17) % 1.2),
    reviewCount: 12 + ((i * 37) % 380),
    images: [img(i * 4 + 1), img(i * 4 + 2), img(i * 4 + 3), img(i * 4 + 4)],
    sizes: i % 4 === 2 ? ["One Size"] : baseSizes,
    colors: palette.slice(0, 3 + (i % 3)),
    description:
      "Crafted from premium materials with meticulous attention to detail. A timeless piece designed to elevate your everyday wardrobe with quiet luxury and lasting comfort.",
    isNew: i % 3 === 0,
    isTrending: i < 8,
  };
};

export const products: Product[] = Array.from({ length: 16 }, (_, i) => seed(i));

export const getProduct = (id: string) => products.find((p) => p.id === id);
