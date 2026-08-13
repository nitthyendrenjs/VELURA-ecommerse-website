import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyAccount, updateMyProfile } from "@/lib/account.functions";
import { formatPrice, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Velura" },
      { name: "description", content: "Manage your Velura profile and review your order history." },
      { property: "og:title", content: "My Account — Velura" },
      { property: "og:description", content: "Manage your Velura profile and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const fetchAccount = useServerFn(getMyAccount);
  const saveProfile = useServerFn(updateMyProfile);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-account"],
    queryFn: () => fetchAccount(),
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (data?.profile) {
      setName(data.profile.full_name ?? "");
      setPhone(data.profile.phone ?? "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => saveProfile({ data: { full_name: name, phone } }),
    onSuccess: () => {
      toast.success("Profile updated");
      refetch();
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-display text-4xl">My Account</h1>
      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[320px_1fr]">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">{data?.profile?.email}</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  Phone
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
                />
              </label>
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl">Order history</h2>
            {data?.orders.length ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((o: any) => (
                      <tr key={o.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{o.order_number}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(o.created_at)}</td>
                        <td className="px-4 py-3 capitalize">{o.status}</td>
                        <td className="px-4 py-3 text-right">{formatPrice(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No orders yet.{" "}
                <Link to="/shop" className="underline">
                  Start shopping
                </Link>
                .
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
