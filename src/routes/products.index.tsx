import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { ProductGrid } from "@/components/site/ProductCard";
import { BRANDS, CATEGORIES, filterProducts, PRODUCTS, type CatalogFilters } from "@/lib/products";

const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : typeof v === "string" ? [v] : undefined);
const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): CatalogFilters => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    category: arr(s["category"]),
    brand: arr(s["brand"]),
    min: num(s["min"]),
    max: num(s["max"]),
    sort: ["low", "high", "rating"].includes(s["sort"] as string) ? (s["sort"] as CatalogFilters["sort"]) : undefined,
    tag: ["best", "new", "promo"].includes(s["tag"] as string) ? (s["tag"] as CatalogFilters["tag"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Katalog Produk Kecantikan — KashaShoop" },
      { name: "description", content: "Cari dan filter skincare, makeup, haircare, bodycare, dan parfum berdasarkan kategori, brand, dan harga." },
      { property: "og:title", content: "Katalog Produk — KashaShoop" },
      { property: "og:description", content: "Jelajahi semua produk kecantikan di KashaShoop." },
    ],
  }),
  component: Catalog,
});

const TAG_LABEL = { best: "Best Seller", new: "Produk Terbaru", promo: "Promo" };

function Catalog() {
  const f = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });
  const [showFilters, setShowFilters] = useState(false);
  const results = filterProducts(PRODUCTS, f);
  const set = (patch: Partial<CatalogFilters>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const toggle = (key: "category" | "brand", v: string) => {
    const cur = f[key] ?? [];
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    set({ [key]: next.length ? next : undefined });
  };

  const title = f.tag ? TAG_LABEL[f.tag] : f.category?.length === 1 ? f.category[0] : "Semua Produk";
  const check = "h-4 w-4 accent-primary";
  const inputCls = "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary";

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Cari</h3>
        <input key={f.q ?? ""} defaultValue={f.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Nama produk / brand" className={inputCls} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold">Kategori</h3>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className={check} checked={f.category?.includes(c) ?? false} onChange={() => toggle("category", c)} /> {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className={check} checked={f.brand?.includes(b) ?? false} onChange={() => toggle("brand", b)} /> {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold">Harga (Rp)</h3>
        <div className="flex items-center gap-2">
          <input type="number" min={0} placeholder="Min" value={f.min ?? ""} onChange={(e) => set({ min: num(e.target.value) })} className={inputCls} />
          <span className="text-muted-foreground">–</span>
          <input type="number" min={0} placeholder="Maks" value={f.max ?? ""} onChange={(e) => set({ max: num(e.target.value) })} className={inputCls} />
        </div>
      </div>
      <Link to="/products" search={{}} className="block text-center text-sm font-semibold text-primary hover:underline">Reset filter</Link>
    </div>
  );

  return (
    <div className="container-k py-8">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">Beranda</Link> / Katalog</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{title}</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">{filters}</aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{results.length}</span> produk ditemukan{f.q ? ` untuk "${f.q}"` : ""}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm md:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filter
              </button>
              <select aria-label="Urutkan" value={f.sort ?? ""} onChange={(e) => set({ sort: (e.target.value || undefined) as CatalogFilters["sort"] })} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary">
                <option value="">Urutkan: Relevan</option>
                <option value="low">Harga Terendah</option>
                <option value="high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
          {showFilters && <div className="mb-6 rounded-xl border p-5 md:hidden">{filters}</div>}
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="rounded-xl border border-dashed py-20 text-center">
              <p className="font-display text-2xl font-semibold">Produk tidak ditemukan</p>
              <p className="mt-2 text-sm text-muted-foreground">Coba ubah kata kunci atau filter pencarianmu.</p>
              <Link to="/products" search={{}} className="mt-5 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Reset filter</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
