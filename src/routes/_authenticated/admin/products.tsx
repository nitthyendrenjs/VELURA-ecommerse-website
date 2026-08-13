import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";
import { adminListProducts, adminDeleteProduct } from "@/lib/admin.functions";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Velura Admin" },
      { name: "description", content: "Create, edit and manage the Velura product catalogue." },
      { property: "og:title", content: "Products — Velura Admin" },
      { property: "og:description", content: "Manage the Velura product catalogue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const list = useServerFn(adminListProducts);
  const del = useServerFn(adminDeleteProduct);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-products", search],
    queryFn: () => list({ data: { search } }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Product deleted");
      refetch();
    },
    onError: (e: Error) => toast.error("Delete failed", { description: e.message }),
  });

  const catName = (id: string | null) =>
    data?.categories.find((c: any) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Products</h1>
        <Link
          to="/admin/products/$id"
          params={{ id: "new" }}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus size={15} /> Add product
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-3 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full rounded-md border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {data?.products.map((p: any) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link
                    to="/admin/products/$id"
                    params={{ id: p.id }}
                    className="flex items-center gap-3"
                  >
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.name} className="h-9 w-9 rounded object-cover" />
                    )}
                    <span className="font-medium underline-offset-2 hover:underline">{p.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{catName(p.category_id)}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) remove.mutate(p.id);
                    }}
                    className="text-destructive hover:opacity-70"
                    aria-label="Delete product"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
