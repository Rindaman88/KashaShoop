import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { ProductGrid, SectionTitle } from "@/components/site/ProductCard";
import { BRANDS, CATEGORIES, CATEGORY_IMAGE, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KashaShoop — Temukan Kecantikanmu" },
      { name: "description", content: "Pilihan skincare dan makeup favorit untuk menemani setiap harimu. Belanja di KashaShoop." },
      { property: "og:title", content: "KashaShoop — Temukan Kecantikanmu" },
      { property: "og:description", content: "Marketplace skincare, makeup, haircare, dan parfum di Indonesia." },
    ],
  }),
  component: Index,
});

const ViewAll = ({ tag }: { tag?: "best" | "new" | "promo" }) => (
  <Link to="/products" search={{ tag }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
    Lihat semua <ArrowRight className="h-4 w-4" />
  </Link>
);

function Index() {
  const best = PRODUCTS.filter((p) => p.tags.includes("best")).slice(0, 8);
  const fresh = PRODUCTS.filter((p) => p.tags.includes("new")).slice(0, 4);
  const rec = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).filter((p) => !p.tags.includes("best")).slice(0, 4);
  const [email, setEmail] = useState("");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Masukkan email yang valid");
    toast.success("Terima kasih! Kamu sudah berlangganan newsletter.");
    setEmail("");
  };

  return (
    <>
      <section className="container-k pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-blush">
          <img src={hero} alt="Koleksi skincare dan makeup KashaShoop" width={1792} height={896} className="h-[420px] w-full object-cover object-right md:h-[520px]" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-6 md:px-14">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blush-foreground">Koleksi Terbaru 2026</span>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">Temukan Kecantikanmu Bersama <span className="italic text-primary">KashaShoop</span></h1>
              <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">Pilihan skincare dan makeup favorit untuk menemani setiap harimu.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" asChild><Link to="/products">Belanja Sekarang</Link></Button>
                <Button size="lg" variant="hero" asChild><Link to="/products" search={{ tag: "promo" }}>Lihat Promo</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-k mt-16">
        <SectionTitle title="Belanja per Kategori" subtitle="Temukan produk sesuai kebutuhanmu" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {CATEGORIES.map((c) => (
            <Link key={c} to="/products" search={{ category: [c] }} className="group flex flex-col items-center gap-2 text-center">
              <div className="aspect-square w-full overflow-hidden rounded-full border-2 border-transparent bg-blush transition-colors group-hover:border-primary">
                <img src={CATEGORY_IMAGE[c]} alt={c} loading="lazy" width={816} height={816} className="h-full w-full object-cover mix-blend-multiply transition-transform group-hover:scale-110" />
              </div>
              <span className="text-sm font-medium group-hover:text-primary">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-k mt-16">
        <SectionTitle title="Brand Pilihan" link={<Link to="/brands" className="text-sm font-semibold text-primary hover:underline">Semua brand</Link>} />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {BRANDS.map((b) => (
            <Link key={b} to="/products" search={{ brand: [b] }} className="flex h-20 min-w-40 flex-1 items-center justify-center rounded-xl border bg-card px-6 font-display text-xl font-semibold tracking-wide transition-colors hover:border-primary hover:text-primary">{b}</Link>
          ))}
        </div>
      </section>

      <section className="container-k mt-16">
        <SectionTitle title="Best Seller" subtitle="Paling banyak dibeli minggu ini" link={<ViewAll tag="best" />} />
        <ProductGrid products={best} />
      </section>

      <section className="container-k mt-16">
        <div className="grid items-center gap-6 overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground md:grid-cols-2 md:p-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Beauty Week Sale</span>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Diskon hingga 30% + ekstra 10%</h2>
            <p className="mt-3 text-sm opacity-90">Gunakan kode <strong>KASHA10</strong> saat checkout. Berlaku untuk semua produk.</p>
          </div>
          <div className="md:text-right">
            <Button size="lg" variant="hero" asChild><Link to="/products" search={{ tag: "promo" }}>Belanja Promo</Link></Button>
          </div>
        </div>
      </section>

      <section className="container-k mt-16">
        <SectionTitle title="Produk Terbaru" subtitle="Baru hadir di KashaShoop" link={<ViewAll tag="new" />} />
        <ProductGrid products={fresh} />
      </section>

      <section className="container-k mt-16">
        <SectionTitle title="Rekomendasi Untukmu" link={<ViewAll />} />
        <ProductGrid products={rec} />
      </section>

      <section className="container-k mt-16">
        <div className="rounded-2xl bg-blush px-6 py-12 text-center md:py-16">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Dapatkan Info Promo Terbaru</h2>
          <p className="mt-2 text-sm text-muted-foreground">Berlangganan newsletter dan jadi yang pertama tahu promo spesial.</p>
          <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Alamat email" aria-label="Email" className="h-11 flex-1 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-primary" />
            <Button size="lg" type="submit">Langganan</Button>
          </form>
        </div>
      </section>
    </>
  );
}
