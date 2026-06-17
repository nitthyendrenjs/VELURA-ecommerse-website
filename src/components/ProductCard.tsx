import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart, useWishlist } from "@/lib/store";
import { Stars, formatPrice } from "./Stars";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  return (
    <div className="group relative flex flex-col">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden rounded-lg bg-secondary"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            New
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute right-3 top-3 rounded-sm bg-[var(--color-gold)] px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-gold-foreground)]">
            -{product.discount}%
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
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="text-sm font-medium text-foreground hover:text-[var(--color-gold)]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              add(product);
              toast.success("Added to cart", { description: product.name });
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
