import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Header";
import { INFO_PAGES } from "@/lib/info";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-secondary">
      <div className="container-k grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">Marketplace kecantikan untuk menemukan skincare dan makeup favoritmu.</p>
          <div className="flex gap-2">
            {[{ I: Instagram, h: "https://instagram.com", l: "Instagram" }, { I: Facebook, h: "https://facebook.com", l: "Facebook" }, { I: Youtube, h: "https://youtube.com", l: "YouTube" }].map(({ I, h, l }) => (
              <a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} className="grid h-9 w-9 place-items-center rounded-full border bg-background hover:border-primary hover:text-primary"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">KashaShoop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {INFO_PAGES.slice(0, 3).map((p) => <li key={p.slug}><Link to="/info/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Bantuan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {INFO_PAGES.slice(3).map((p) => <li key={p.slug}><Link to="/info/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold">Belanja</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">Semua Produk</Link></li>
            <li><Link to="/brands" className="hover:text-primary">Brands</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Keranjang</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © 2026 KashaShoop · Situs demo — harga, rating, ulasan, dan stok adalah data contoh.
      </div>
    </footer>
  );
}
