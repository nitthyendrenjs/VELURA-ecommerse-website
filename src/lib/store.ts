import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  promo: string | null;
  add: (product: Product, size?: string, color?: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      add: (product, size, color, qty = 1) => {
        const s = size ?? product.sizes[0];
        const c = color ?? product.colors[0];
        const key = `${product.id}-${s}-${c}`;
        const existing = get().items.find((i) => i.id === key);
        if (existing) {
          set({ items: get().items.map((i) => (i.id === key ? { ...i, quantity: i.quantity + qty } : i)) });
        } else {
          set({ items: [...get().items, { id: key, product, size: s, color: c, quantity: qty }] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [], promo: null }),
      applyPromo: (code) => {
        if (code.trim().toUpperCase() === "VELURA10") {
          set({ promo: "VELURA10" });
          return true;
        }
        return false;
      },
      removePromo: () => set({ promo: null }),
      subtotal: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      discount: () => (get().promo ? get().subtotal() * 0.1 : 0),
      total: () => get().subtotal() - get().discount(),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "velura-cart" }
  )
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
    { name: "velura-wishlist" }
  )
);

type UIState = {
  cartOpen: boolean;
  authOpen: boolean;
  authTab: "login" | "signup";
  searchOpen: boolean;
  mobileNavOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean, tab?: "login" | "signup") => void;
  setSearchOpen: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  authOpen: false,
  authTab: "login",
  searchOpen: false,
  mobileNavOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  setAuthOpen: (v, tab) => set({ authOpen: v, authTab: tab ?? "login" }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
}));
