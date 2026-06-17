import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/products";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { Stars, formatPrice } from "@/components/Stars";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Velura` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.product.name} — Velura` },
          { property: "og:image", content: loaderData.product.images[0] },
        ]
      : [],
  }),
  component: Detail,
  notFoundComponent: () => (
    <div className="container-luxe py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-luxe py-24 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
});

const reviews = [
  { name: "Sarah L.", rating: 5, text: "Exceptional quality. Fits true to size and the fabric feels luxurious." },
  { name: "Marcus T.", rating: 4, text: "Beautiful piece. Slightly long on me but the tailor sorted it easily." },
  { name: "Elena R.", rating: 5, text: "My third Velura piece — they just keep getting better." },
];

function Detail() {
  const { product } = Route.useLoaderData()!;
  const [mainImg, setMainImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "size" | "reviews">("desc");

  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const navigate = useNavigate();

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="container-luxe py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <button onClick={() => navigate({ to: "/" })} className="hover:text-foreground">Home</button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate({ to: "/shop" })} className="hover:text-foreground">Shop</button>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg bg-secondary">
            <img src={product.images[mainImg]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setMainImg(i)}
                className={`overflow-hidden rounded-md border-2 transition ${
                  mainImg === i ? "border-[var(--color-gold)]" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={product.rating} size={16} />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-sm bg-[var(--color-gold)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-gold-foreground)]">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 rounded-md border px-4 py-2.5 text-sm transition ${
                    size === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    color === c ? "border-[var(--color-gold)] ring-2 ring-[var(--color-gold)]/20" : "border-border"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center hover:bg-secondary" aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center hover:bg-secondary" aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, size, color, qty);
                toast.success("Added to cart", { description: product.name });
                setCartOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
            <button
              onClick={() => {
                const added = toggle(product.id);
                toast(added ? "Added to wishlist" : "Removed from wishlist");
              }}
              aria-label="Wishlist"
              className="grid h-12 w-12 place-items-center rounded-md border border-border hover:bg-secondary"
            >
              <Heart size={16} className={wished ? "fill-destructive text-destructive" : ""} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-xs">
            {[
              { i: Truck, l: "Free shipping over $99" },
              { i: RotateCcw, l: "30-day returns" },
              { i: Shield, l: "Authenticity guaranteed" },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <b.i size={18} className="text-[var(--color-gold)]" />
                {b.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-border">
          {([
            ["desc", "Description"],
            ["size", "Size Guide"],
            ["reviews", `Reviews (${reviews.length})`],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
                tab === k ? "border-[var(--color-gold)] text-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="prose prose-sm max-w-2xl py-8 text-foreground">
          {tab === "desc" && <p className="text-muted-foreground">{product.description}</p>}
          {tab === "size" && (
            <div className="text-muted-foreground">
              <p>True to size. If between sizes, we recommend sizing up for a relaxed fit.</p>
              <table className="mt-4 w-full text-sm">
                <thead><tr className="border-b border-border text-left"><th className="py-2">Size</th><th>Chest</th><th>Length</th></tr></thead>
                <tbody>
                  {[["S","36-38","27"],["M","38-40","28"],["L","40-42","29"],["XL","42-44","30"]].map(r => (
                    <tr key={r[0]} className="border-b border-border"><td className="py-2">{r[0]}</td><td>{r[1]}"</td><td>{r[2]}"</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "reviews" && (
            <ul className="space-y-6">
              {reviews.map((r, i) => (
                <li key={i} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center gap-3"><Stars rating={r.rating} /> <span className="text-sm font-medium">{r.name}</span></div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-3xl font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
