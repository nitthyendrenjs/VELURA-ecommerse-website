import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";
import { useCart, useWishlist } from "@/lib/store";
import { formatPrice } from "@/components/Stars";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Velura" }] }),
  component: Wishlist,
});

function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-4xl font-semibold md:text-5xl">Your Wishlist</h1>
      <p className="mt-2 text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} saved for later.
      </p>

      {items.length === 0 ? (
        <div className="mt-16 grid place-items-center rounded-xl bg-card p-16 text-center shadow-soft">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <Heart className="text-muted-foreground" />
          </div>
          <p className="mt-4 font-display text-2xl">No favorites yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Start exploring and save the pieces you love.
          </p>
          <Link
            to="/shop"
            className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl bg-card shadow-soft">
              <Link to="/product/$id" params={{ id: p.id }}>
                <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" />
              </Link>
              <div className="p-5">
                <Link to="/product/$id" params={{ id: p.id }} className="font-medium hover:text-[var(--color-gold)]">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{formatPrice(p.price)}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      add(p);
                      remove(p.id);
                      toast.success("Moved to cart");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label="Remove"
                    className="grid h-10 w-10 place-items-center rounded-md border border-border hover:bg-secondary"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
