import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — KashaShoop" },
      { name: "description", content: "Jelajahi brand kecantikan yang tersedia di KashaShoop." },
      { property: "og:title", content: "Brands — KashaShoop" },
      { property: "og:description", content: "SOMETHINC, Wardah, Azarine, SKINTIFIC, Maybelline, COSRX dan lainnya." },
    ],
  }),
  component: Brands,
});

function Brands() {
  return (
    <div className="container-k py-10">
      <h1 className="font-display text-4xl font-semibold">Brands</h1>
      <p className="mt-1 text-sm text-muted-foreground">Nama brand ditampilkan sebagai label teks; tidak menyiratkan kemitraan resmi.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {BRANDS.map((b) => (
          <Link key={b} to="/products" search={{ brand: [b] }} className="rounded-2xl border p-8 text-center transition-colors hover:border-primary hover:bg-blush">
            <p className="font-display text-2xl font-semibold">{b}</p>
            <p className="mt-1 text-xs text-muted-foreground">{PRODUCTS.filter((p) => p.brand === b).length} produk</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
