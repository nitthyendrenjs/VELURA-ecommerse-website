import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Store,
} from "lucide-react";
import { getMyRoles } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/discounts", label: "Discounts", icon: Tag },
] as const;

function AdminLayout() {
  const fetchRoles = useServerFn(getMyRoles);
  const { data, isLoading } = useQuery({ queryKey: ["my-roles"], queryFn: () => fetchRoles() });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLoading) {
    return <div className="px-6 py-20 text-center text-sm text-muted-foreground">Loading admin…</div>;
  }

  if (!data?.isStaff) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Restricted area</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account does not have staff access to the Velura admin portal.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-secondary/40">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Store size={18} className="text-[var(--color-gold)]" />
          <span className="font-display text-lg">Velura Admin</span>
        </div>
        <nav className="p-3">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
