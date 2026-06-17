import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { products, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop the Collection — Velura" },
      { name: "description", content: "Browse Velura's full collection of premium clothing, accessories, and lifestyle pieces." },
    ],
  }),
  component: Shop,
});

const cats: Product["category"][] = ["Men", "Women", "Accessories", "Sale"];
type Sort = "newest" | "low" | "high" | "popular";
const sorts: { v: Sort; l: string }[] = [
  { v: "newest", l: "Newest" },
  { v: "low", l: "Price: Low to High" },
  { v: "high", l: "Price: High to Low" },
  { v: "popular", l: "Most Popular" },
];

function Shop() {
  const [selectedCats, setCats] = useState<string[]>([]);
  const [price, setPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("newest");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = products.filter(
      (p) =>
        (selectedCats.length === 0 || selectedCats.includes(p.category)) &&
        p.price <= price &&
        p.rating >= minRating &&
        (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "popular") r = [...r].sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === "newest") r = [...r].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return r;
  }, [selectedCats, price, minRating, sort, q]);

  const visible = filtered.slice(0, limit);

  const chips: { label: string; clear: () => void }[] = [
    ...selectedCats.map((c) => ({ label: c, clear: () => setCats((s) => s.filter((x) => x !== c)) })),
    ...(price < 500 ? [{ label: `Under $${price}`, clear: () => setPrice(500) }] : []),
    ...(minRating > 0 ? [{ label: `${minRating}+ stars`, clear: () => setMinRating(0) }] : []),
  ];

  const Sidebar = (
    <aside className="space-y-8">
      <FilterGroup title="Category">
        {cats.map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedCats.includes(c)}
              onChange={() =>
                setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))
              }
              className="h-4 w-4 accent-[var(--color-gold)]"
            />
            {c}
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        <input
          type="range"
          min={0}
          max={500}
          step={10}
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          className="w-full accent-[var(--color-gold)]"
        />
        <p className="text-sm text-muted-foreground">Up to ${price}</p>
      </FilterGroup>
      <FilterGroup title="Rating">
        {[4, 3, 2, 0].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={minRating === r}
              onChange={() => setMinRating(r)}
              className="h-4 w-4 accent-[var(--color-gold)]"
            />
            {r === 0 ? "All ratings" : `${r}+ stars`}
          </label>
        ))}
      </FilterGroup>
    </aside>
  );

  return (
    <div className="container-luxe py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Shop</h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} in the collection.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none"
        >
          {sorts.map((s) => (
            <option key={s.v} value={s.v}>{s.l}</option>
          ))}
        </select>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm md:hidden"
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs"
            >
              {c.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <div className="hidden md:block">{Sidebar}</div>
        <div>
          {visible.length === 0 ? (
            <div className="rounded-lg bg-card p-12 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {limit < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setLimit((l) => l + 6)}
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm md:hidden" onClick={() => setDrawerOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>
            {Sidebar}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
