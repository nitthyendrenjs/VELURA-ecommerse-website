import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/catalog.functions";
import type { Category, ProductWithCategory } from "@/lib/types";

export const Route = createFileRoute("/shop")({
  loader: async () => ({
    products: await listProducts({ data: { sort: "newest", limit: 24 } }),
    categories: await listCategories(),
  }),
  head: () => ({
    meta: [
      { title: "Shop All Products — Velura" },
      {
        name: "description",
        content:
          "Browse Velura's full catalogue — apparel, accessories, home, electronics, beauty and footwear.",
      },
      { property: "og:title", content: "Shop All Products — Velura" },
      { property: "og:description", content: "Browse Velura's full catalogue across every category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

type Sort = "newest" | "low" | "high" | "popular";
const sorts: { v: Sort; l: string }[] = [
  { v: "newest", l: "Newest" },
  { v: "low", l: "Price: Low to High" },
  { v: "high", l: "Price: High to Low" },
  { v: "popular", l: "Most Popular" },
];

function Shop() {
  const initial = Route.useLoaderData();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [q, setQ] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["products", category, sort, q],
    queryFn: () => listProducts({ data: { category, sort, search: q || undefined, limit: 48 } }),
    initialData: initial.products as ProductWithCategory[],
  });

  const categories = initial.categories as Category[];
  const items = (data ?? []) as ProductWithCategory[];

  return (
    <div className="container-luxe py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Shop</h1>
        <p className="mt-2 text-muted-foreground">
          {items.length} {items.length === 1 ? "product" : "products"} available.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-md border border-border bg-card px-4 py-2.5 text-sm outline-none"
        >
          {sorts.map((s) => (
            <option key={s.v} value={s.v}>
              {s.l}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {[{ id: "all", name: "All", slug: "all" }, ...categories].map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              category === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg bg-card p-12 text-center text-muted-foreground">
          No products match your search.
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
