import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
  weightGrams: number;
  sku: string | null;
};

export type AppliedPromo = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  amount: number;
};

type CartState = {
  items: CartItem[];
  promo: AppliedPromo | null;
  add: (product: Product, variant?: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setPromo: (p: AppliedPromo | null) => void;
  subtotal: () => number;
  discount: () => number;
  weight: () => number;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      add: (product, variant = "", qty = 1) => {
        const key = `${product.id}::${variant}`;
        const existing = get().items.find((i) => i.id === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === key ? { ...i, quantity: i.quantity + qty } : i,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              id: key,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images?.[0] ?? "",
              price: Number(product.price),
              variant,
              quantity: qty,
              weightGrams: product.weight_grams ?? 500,
              sku: product.sku ?? null,
            },
          ],
        });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, qty) } : i,
          ),
        }),
      clear: () => set({ items: [], promo: null }),
      setPromo: (p) => set({ promo: p }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      discount: () => {
        const promo = get().promo;
        if (!promo) return 0;
        const sub = get().subtotal();
        const amount = promo.type === "percent" ? (sub * promo.value) / 100 : promo.value;
        return Math.min(Math.round(amount), sub);
      },
      weight: () =>
        get().items.reduce((s, i) => s + (i.weightGrams || 500) * i.quantity, 0),
      total: () => get().subtotal() - get().discount(),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "velura-cart-v2" },
  ),
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        if (get().ids.includes(id)) {
          set({ ids: get().ids.filter((x) => x !== id) });
          return false;
        }
        set({ ids: [...get().ids, id] });
        return true;
      },
      has: (id) => get().ids.includes(id),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: "velura-wishlist-v2" },
  ),
);

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  mobileNavOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
}));
