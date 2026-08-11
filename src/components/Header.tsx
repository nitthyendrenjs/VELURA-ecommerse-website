import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, LogOut, Package, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
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
  const user = useAuth((s) => s.user);
  const session = useAuth((s) => s.session);

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
            {session ? <UserMenu /> : <IconBtn label="Account" onClick={() => setAuthOpen(true, "login")}>
              <User size={18} />
            </IconBtn>}
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

function UserMenu() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const name = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "Account";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full px-2 py-1 hover:bg-secondary"
      >
        <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </div>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-card shadow-luxe">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="p-1.5">
            <MenuItem icon={<Package size={15} />} label="My Orders" onClick={() => { setOpen(false); navigate({ to: "/account" }); }} />
            <MenuItem icon={<User size={15} />} label="My Account" onClick={() => { setOpen(false); navigate({ to: "/account" }); }} />
            <MenuItem icon={<LogOut size={15} />} label="Sign Out" onClick={() => { setOpen(false); signOut(); }} danger />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition hover:bg-secondary ${danger ? "text-destructive" : "text-foreground"}`}
    >
      {icon}
      {label}
    </button>
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

  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: () => listProducts({ data: { search: q, limit: 6, sort: "popular" } }),
    enabled: open && q.length > 1,
  });
  const results = (q.length > 1 ? ((data ?? []) as ProductWithCategory[]) : []).slice(0, 6);

  if (!open) return null;


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
                navigate({ to: "/product/$slug", params: { slug: p.slug } });
              }}
              className="flex w-full items-center gap-4 rounded-md p-2 text-left hover:bg-secondary"
            >
              <img src={p.images?.[0]} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category_name}</p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(p.price)}</span>

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
