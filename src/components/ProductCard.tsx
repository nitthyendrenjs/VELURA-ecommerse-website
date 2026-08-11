import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductWithCategory } from "@/lib/types";
import { discountPercent } from "@/lib/types";
import { useCart, useWishlist } from "@/lib/store";
import { Stars } from "./Stars";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product | ProductWithCategory }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const off = discountPercent(product);
  const categoryName = (product as ProductWithCategory).category_name ?? product.brand ?? "";
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-lg bg-secondary"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {product.is_new && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            New
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-3 top-3 rounded-sm bg-[var(--color-gold)] px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-gold-foreground)]">
            -{off}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-primary/80 py-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            Out of stock
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const added = toggle(product.id);
            toast(added ? "Added to wishlist" : "Removed from wishlist");
          }}
          aria-label="Toggle wishlist"
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
        >
          <Heart
            size={16}
            className={wished ? "fill-destructive text-destructive" : "text-foreground"}
          />
        </button>
      </Link>
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{categoryName}</p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="text-sm font-medium text-foreground hover:text-[var(--color-gold)]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <Stars rating={Number(product.rating)} />
          <span className="text-xs text-muted-foreground">({product.review_count})</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">{formatPrice(product.price)}</span>
            {off > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              add(product, defaultVariant(product));
              toast.success("Added to cart", { description: product.name });
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function defaultVariant(product: Product) {
  const opts = Array.isArray(product.options) ? product.options : [];
  return opts
    .filter((o) => o.values?.length)
    .map((o) => `${o.name}: ${o.values[0]}`)
    .join(" / ");
}
