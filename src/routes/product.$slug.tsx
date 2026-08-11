import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/catalog.functions";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { Stars } from "@/components/Stars";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { discountPercent, type Product, type ProductWithCategory } from "@/lib/types";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const result = await getProductBySlug({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Velura` },
          {
            name: "description",
            content: (loaderData.product.description ?? "").slice(0, 155),
          },
          { property: "og:title", content: `${loaderData.product.name} — Velura` },
          {
            property: "og:description",
            content: (loaderData.product.description ?? "").slice(0, 155),
          },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
          ...(loaderData.product.images?.[0]?.startsWith("https://")
            ? [
                { property: "og:image", content: loaderData.product.images[0] },
                { name: "twitter:image", content: loaderData.product.images[0] },
              ]
            : []),
        ]
      : [],
  }),
  component: Detail,
  notFoundComponent: () => (
    <div className="container-luxe py-24 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-sm text-[var(--color-gold)]">
        Back to shop →
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-luxe py-24 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function Detail() {
  const { product, related } = Route.useLoaderData() as {
    product: ProductWithCategory;
    related: Product[];
  };
  const options = Array.isArray(product.options) ? product.options : [];
  const [mainImg, setMainImg] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.filter((o) => o.values?.length).map((o) => [o.name, o.values[0]])),
  );
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "shipping">("desc");

  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const toggle = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const navigate = useNavigate();

  const off = discountPercent(product);
  const variant = Object.entries(selected)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" / ");
  const outOfStock = product.stock <= 0;

  return (
    <div className="container-luxe py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <button onClick={() => navigate({ to: "/" })} className="hover:text-foreground">
          Home
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate({ to: "/shop" })} className="hover:text-foreground">
          Shop
        </button>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg bg-secondary">
            <img
              src={product.images?.[mainImg]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
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
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {product.category_name ?? product.brand}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={Number(product.rating)} size={16} />
            <span className="text-sm text-muted-foreground">
              {Number(product.rating).toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
                <span className="rounded-sm bg-[var(--color-gold)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-gold-foreground)]">
                  Save {off}%
                </span>
              </>
            )}
          </div>

          {options.map((opt) => (
            <div key={opt.name} className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {opt.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelected((s) => ({ ...s, [opt.name]: v }))}
                    className={`min-w-12 rounded-md border px-4 py-2.5 text-sm transition ${
                      selected[opt.name] === v
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <p className="mt-6 text-sm text-muted-foreground">
            {outOfStock
              ? "Currently out of stock"
              : product.stock <= product.low_stock_threshold
                ? `Only ${product.stock} left in stock`
                : "In stock"}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center hover:bg-secondary"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center hover:bg-secondary"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              disabled={outOfStock}
              onClick={() => {
                add(product, variant, qty);
                toast.success("Added to cart", { description: product.name });
                setCartOpen(true);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
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
              { i: Truck, l: "Free shipping over ₹999" },
              { i: RotateCcw, l: "7-day easy returns" },
              { i: Shield, l: "Genuine products" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 text-center text-muted-foreground"
              >
                <b.i size={18} className="text-[var(--color-gold)]" />
                {b.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex gap-6 border-b border-border">
          {(
            [
              ["desc", "Description"],
              ["shipping", "Shipping & Returns"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
                tab === k
                  ? "border-[var(--color-gold)] text-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="max-w-2xl py-8 text-sm text-muted-foreground">
          {tab === "desc" ? (
            <p>{product.description}</p>
          ) : (
            <p>
              Dispatched within 24 hours from our warehouse and delivered by our logistics partner.
              Delivery timelines are shown at checkout based on your pincode. Returns accepted
              within 7 days of delivery on unused items in original packaging.
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-3xl font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
