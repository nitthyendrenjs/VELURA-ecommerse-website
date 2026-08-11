import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/catalog.functions";
import { formatPrice } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/types";


const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Categories", search: { category: "all" } },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const { setCartOpen, setAuthOpen, setSearchOpen, setMobileNavOpen, mobileNavOpen } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "bg-background"
        }`}
      >
        <div className="container-luxe flex h-16 items-center justify-between gap-4 md:h-20">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="font-display text-2xl font-bold tracking-[0.18em] text-primary">
            VELURA
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-medium text-foreground/80 transition hover:text-[var(--color-gold)]"
                activeProps={{ className: "text-[var(--color-gold)]" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </IconBtn>
            <IconBtn label="Account" onClick={() => setAuthOpen(true, "login")}>
              <User size={18} />
            </IconBtn>
            <Link
              to="/wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishCount > 0 && <Badge>{wishCount}</Badge>}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && <MobileNav onClose={() => setMobileNavOpen(false)} />}
    </>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-semibold text-[var(--color-gold-foreground)]">
      {children}
    </span>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="container-luxe flex h-16 items-center justify-between">
        <span className="font-display text-2xl font-bold tracking-[0.18em] text-primary">VELURA</span>
        <button onClick={onClose} aria-label="Close menu">
          <X size={22} />
        </button>
      </div>
      <nav className="container-luxe mt-12 flex flex-col gap-6">
        {navLinks.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            onClick={onClose}
            className="font-display text-3xl text-foreground hover:text-[var(--color-gold)]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SearchModal() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;
  const results = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-primary/40 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="mt-24 w-full max-w-2xl rounded-lg bg-card shadow-luxe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search size={18} className="text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {q && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No products found.</p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setOpen(false);
                navigate({ to: "/product/$id", params: { id: p.id } });
              }}
              className="flex w-full items-center gap-4 rounded-md p-2 text-left hover:bg-secondary"
            >
              <img src={p.images[0]} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <span className="text-sm font-semibold">${p.price}</span>
            </button>
          ))}
          {!q && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Start typing to search the collection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
