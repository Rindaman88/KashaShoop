import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";

export function Logo() {
  return (
    <Link to="/" className="font-display text-3xl font-semibold tracking-tight text-foreground">
      Kasha<span className="italic text-primary">Shoop</span>
    </Link>
  );
}

const NAV: { label: string; search: Record<string, unknown> }[] = [
  { label: "Skincare", search: { category: ["Skincare"] } },
  { label: "Makeup", search: { category: ["Makeup"] } },
  { label: "Haircare", search: { category: ["Haircare"] } },
  { label: "Bodycare", search: { category: ["Bodycare"] } },
  { label: "Parfum", search: { category: ["Parfum"] } },
  { label: "Best Seller", search: { tag: "best" } },
  { label: "Produk Terbaru", search: { tag: "new" } },
  { label: "Promo", search: { tag: "promo" } },
];

export function Header() {
  const { cartCount, wishlist, user } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q: q.trim() || undefined } });
    setOpen(false);
  };

  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full hover:bg-blush transition-colors";
  const badge = "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground";

  const searchForm = (
    <form onSubmit={submit} className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari produk atau brand favoritmu..."
        aria-label="Cari produk"
        className="h-11 w-full rounded-full border border-input bg-muted pl-11 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="bg-blush py-2 text-center text-xs font-medium text-blush-foreground">
        Belanja produk kecantikan favoritmu di KashaShoop! Gratis ongkir min. Rp200.000
      </div>
      <div className="container-k flex h-16 items-center gap-4 md:h-20 md:gap-8">
        <button className={`${iconBtn} md:hidden`} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Logo />
        <div className="hidden flex-1 md:block">{searchForm}</div>
        <div className="ml-auto flex items-center gap-1">
          <Link to={user ? "/account" : "/login"} className={iconBtn} aria-label="Akun"><User className="h-5 w-5" /></Link>
          <Link to="/wishlist" className={iconBtn} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <span className={badge}>{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className={iconBtn} aria-label="Keranjang">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className={badge}>{cartCount}</span>}
          </Link>
        </div>
      </div>
      <div className="container-k pb-3 md:hidden">{searchForm}</div>
      <nav className="hidden border-t md:block">
        <div className="container-k flex h-12 items-center gap-7 text-sm font-medium">
          <Link to="/" className="hover:text-primary" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Beranda</Link>
          {NAV.slice(0, 5).map((n) => (
            <Link key={n.label} to="/products" search={n.search} className="hover:text-primary">{n.label}</Link>
          ))}
          <Link to="/brands" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Brands</Link>
          {NAV.slice(5).map((n) => (
            <Link key={n.label} to="/products" search={n.search} className={n.label === "Promo" ? "text-primary hover:opacity-80" : "hover:text-primary"}>{n.label}</Link>
          ))}
        </div>
      </nav>
      {open && (
        <nav className="border-t md:hidden">
          <div className="container-k flex flex-col py-2 text-sm font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="py-3">Beranda</Link>
            {NAV.slice(0, 5).map((n) => (
              <Link key={n.label} to="/products" search={n.search} onClick={() => setOpen(false)} className="border-t py-3">{n.label}</Link>
            ))}
            <Link to="/brands" onClick={() => setOpen(false)} className="border-t py-3">Brands</Link>
            {NAV.slice(5).map((n) => (
              <Link key={n.label} to="/products" search={n.search} onClick={() => setOpen(false)} className="border-t py-3">{n.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
