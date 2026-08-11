import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart, useUI } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const { items, remove, setQty, promo, setPromo, subtotal, discount, total } = useCart();
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-luxe transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-xl">Your Bag ({items.length})</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover products you'll love and add them here.
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate({ to: "/shop" });
              }}
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-4">
                    <img src={i.image} alt={i.name} className="h-24 w-20 rounded-md object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium">{i.name}</p>
                        <button
                          onClick={() => remove(i.id)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {i.variant && (
                        <p className="text-xs text-muted-foreground">{i.variant}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => setQty(i.id, i.quantity - 1)}
                            className="grid h-7 w-7 place-items-center hover:bg-secondary"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-sm">{i.quantity}</span>
                          <button
                            onClick={() => setQty(i.id, i.quantity + 1)}
                            className="grid h-7 w-7 place-items-center hover:bg-secondary"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(i.price * i.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-secondary/50 px-5 py-4">
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <button
                  onClick={() => {
                    const ok = code.trim().toUpperCase() === "VELURA10";
                    if (ok) {
                      setPromo({ code: "VELURA10", type: "percent", value: 10, amount: 0 });
                      setCode("");
                    }
                    toast[ok ? "success" : "error"](
                      ok ? "Promo applied: 10% off" : "Invalid promo code",
                    );
                  }}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
              {promo && (
                <button
                  onClick={() => setPromo(null)}
                  className="mt-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove promo ({promo.code})
                </button>
              )}

              <div className="mt-4 space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal())} />
                {promo && <Row label="Discount" value={`-${formatPrice(discount())}`} />}
                <div className="my-2 border-t border-border" />
                <Row label="Total" value={formatPrice(total())} bold />
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/checkout" });
                }}
                className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Checkout
              </button>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
