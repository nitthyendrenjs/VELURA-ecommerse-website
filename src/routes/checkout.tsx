import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/components/Stars";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Velura" }] }),
  component: Checkout,
});

type Shipping = {
  name: string; email: string; phone: string; address: string;
  city: string; state: string; pin: string; country: string;
};

function Checkout() {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, subtotal, total, discount, promo, clear } = useCart();

  const [ship, setShip] = useState<Shipping>({
    name: "", email: "", phone: "", address: "", city: "", state: "", pin: "", country: "United States",
  });
  const [pay, setPay] = useState<"card" | "upi" | "cod">("card");
  const [card, setCard] = useState({ number: "", cvv: "", expiry: "", name: "" });

  if (orderId) return <Confirmation id={orderId} />;
  if (items.length === 0)
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-[var(--color-gold)]">Browse the shop →</Link>
      </div>
    );

  const steps = ["Shipping", "Payment", "Review"];

  const placeOrder = () => {
    const id = "VLR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrderId(id);
    clear();
    setTimeout(() => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }, 200);
  };

  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>

      <div className="mt-8 flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-3">
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-medium ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl bg-card p-6 shadow-soft md:p-8">
          {step === 0 && (
            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={(e) => { e.preventDefault(); setStep(1); }}
            >
              <Input label="Full Name" value={ship.name} onChange={(v) => setShip({ ...ship, name: v })} required />
              <Input label="Email" type="email" value={ship.email} onChange={(v) => setShip({ ...ship, email: v })} required />
              <Input label="Phone" value={ship.phone} onChange={(v) => setShip({ ...ship, phone: v })} required />
              <Input label="Country" value={ship.country} onChange={(v) => setShip({ ...ship, country: v })} required />
              <div className="md:col-span-2">
                <Input label="Address" value={ship.address} onChange={(v) => setShip({ ...ship, address: v })} required />
              </div>
              <Input label="City" value={ship.city} onChange={(v) => setShip({ ...ship, city: v })} required />
              <Input label="State" value={ship.state} onChange={(v) => setShip({ ...ship, state: v })} required />
              <Input label="Postal Code" value={ship.pin} onChange={(v) => setShip({ ...ship, pin: v })} required />
              <div className="md:col-span-2 mt-2">
                <button className="w-full rounded-md bg-primary py-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Continue to Payment
                </button>
              </div>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment Method</p>
              <div className="space-y-2">
                {([
                  ["card", "Credit / Debit Card"],
                  ["upi", "UPI"],
                  ["cod", "Cash on Delivery"],
                ] as const).map(([v, l]) => (
                  <label
                    key={v}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition ${
                      pay === v ? "border-[var(--color-gold)] bg-secondary" : "border-border"
                    }`}
                  >
                    <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} className="accent-[var(--color-gold)]" />
                    <span className="text-sm font-medium">{l}</span>
                  </label>
                ))}
              </div>

              {pay === "card" && (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Input label="Name on Card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} required />
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Card Number" value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="•••• •••• •••• ••••" required />
                  </div>
                  <Input label="Expiry (MM/YY)" value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v })} required />
                  <Input label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} required />
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="rounded-md border border-border px-5 py-3 text-sm">Back</button>
                <button className="flex-1 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Review Order
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <ReviewBlock title="Shipping to">
                <p>{ship.name}</p>
                <p className="text-muted-foreground">{ship.address}, {ship.city}, {ship.state} {ship.pin}</p>
                <p className="text-muted-foreground">{ship.country} · {ship.phone}</p>
              </ReviewBlock>
              <ReviewBlock title="Payment">
                <p className="flex items-center gap-2"><CreditCard size={16} /> {pay === "card" ? `Card ending in ${card.number.slice(-4) || "••••"}` : pay.toUpperCase()}</p>
              </ReviewBlock>
              <ReviewBlock title="Items">
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3">
                      <img src={i.image} alt="" className="h-12 w-12 rounded object-cover" />
                      <span className="flex-1 text-sm">{i.name} × {i.quantity}</span>
                      <span className="text-sm font-medium">{formatPrice(i.price * i.quantity)}</span>
                    </li>
                  ))}

                </ul>
              </ReviewBlock>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="rounded-md border border-border px-5 py-3 text-sm">Back</button>
                <button onClick={placeOrder} className="flex-1 rounded-md bg-[var(--color-gold)] py-3 text-sm font-semibold text-[var(--color-gold-foreground)] hover:brightness-105">
                  Place Order · {formatPrice(total())}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl bg-card p-6 shadow-soft">
          <h3 className="font-display text-xl">Order Summary</h3>
          <ul className="mt-4 space-y-3 border-b border-border pb-4">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <img src={i.product.images[0]} className="h-10 w-10 rounded object-cover" alt="" />
                <span className="flex-1 truncate">{i.product.name}</span>
                <span>×{i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 text-sm">
            <Row l="Subtotal" v={formatPrice(subtotal())} />
            {promo && <Row l="Promo (10%)" v={`-${formatPrice(discount())}`} />}
            <Row l="Shipping" v="Free" />
            <div className="my-2 border-t border-border" />
            <Row l="Total" v={formatPrice(total())} bold />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
      />
    </label>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{l}</span><span>{v}</span>
    </div>
  );
}

function Confirmation({ id }: { id: string }) {
  return (
    <div className="container-luxe grid place-items-center py-24 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-gold-foreground)]">
        <Check size={36} />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold md:text-5xl">Thank you for your order</h1>
      <p className="mt-3 text-muted-foreground">Your order <span className="font-mono text-foreground">{id}</span> is confirmed. A receipt is on its way.</p>
      <Link to="/shop" className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Continue Shopping
      </Link>
    </div>
  );
}
