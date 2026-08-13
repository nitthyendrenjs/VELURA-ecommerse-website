import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { IndianRupee, ShoppingBag, Users, TriangleAlert } from "lucide-react";
import { getAdminDashboard } from "@/lib/admin.functions";
import { formatPrice, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Velura" },
      { name: "description", content: "Revenue, orders and inventory health for the Velura store." },
      { property: "og:title", content: "Admin Dashboard — Velura" },
      { property: "og:description", content: "Revenue, orders and inventory health." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchDash = useServerFn(getAdminDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["admin-dash"], queryFn: () => fetchDash() });

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const max = Math.max(1, ...data.series.map((s: any) => s.total));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={formatPrice(data.revenue)} icon={<IndianRupee size={16} />} />
        <Stat label="Orders" value={String(data.orderCount)} icon={<ShoppingBag size={16} />} />
        <Stat label="Avg order value" value={formatPrice(data.aov)} icon={<IndianRupee size={16} />} />
        <Stat label="Customers" value={String(data.customerCount)} icon={<Users size={16} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Sales (last 14 days with activity)">
          {data.series.length ? (
            <div className="flex h-44 items-end gap-2">
              {data.series.map((s: any) => (
                <div key={s.date} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-[var(--color-gold)]"
                    style={{ height: `${Math.max(4, (s.total / max) * 140)}px` }}
                    title={`${s.date}: ${formatPrice(s.total)}`}
                  />
                  <span className="text-[10px] text-muted-foreground">{s.date.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          )}
        </Card>

        <Card title="Low stock">
          {data.lowStock.length ? (
            <ul className="space-y-2 text-sm">
              {data.lowStock.map((p: any) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <span className="truncate">{p.name}</span>
                  <span className="flex items-center gap-1 text-destructive">
                    <TriangleAlert size={13} /> {p.stock}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">All stock levels healthy.</p>
          )}
        </Card>
      </div>

      <Card title="Recent orders">
        {data.recentOrders.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o: any) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="py-2">
                    <Link to="/admin/orders/$id" params={{ id: o.id }} className="underline">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-2">{o.customer_name}</td>
                  <td className="py-2 text-muted-foreground">{formatDate(o.created_at)}</td>
                  <td className="py-2 capitalize">{o.status}</td>
                  <td className="py-2 text-right">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-2xl">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg">{title}</h2>
      {children}
    </div>
  );
}
