import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-luxe grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.18em]">VELURA</p>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Quiet luxury for the modern wardrobe. Designed in Milan, made to last.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/20 transition hover:bg-[var(--color-gold)] hover:text-[var(--color-gold-foreground)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <Column title="Quick Links">
          <FLink to="/shop">Shop All</FLink>
          <FLink to="/about">About</FLink>
          <FLink to="/contact">Contact</FLink>
          <FLink to="/wishlist">Wishlist</FLink>
        </Column>

        <Column title="Customer Service">
          <FLink to="/contact">Help Center</FLink>
          <FLink to="/contact">Shipping & Returns</FLink>
          <FLink to="/contact">Size Guide</FLink>
          <FLink to="/contact">Track Order</FLink>
        </Column>

        <div>
          <h4 className="font-display text-lg">Newsletter</h4>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Be first to know about new arrivals and private sales.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              toast.success("You're in! 🎉");
              setEmail("");
            }}
            className="mt-4 flex overflow-hidden rounded-md border border-primary-foreground/20"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-primary-foreground/40"
            />
            <button
              type="submit"
              className="bg-[var(--color-gold)] px-4 text-sm font-medium text-[var(--color-gold-foreground)] hover:brightness-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row">
          <p>© 2025 Velura. All Rights Reserved.</p>
          <div className="flex gap-5">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-lg">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="hover:text-[var(--color-gold)]">
        {children}
      </Link>
    </li>
  );
}
