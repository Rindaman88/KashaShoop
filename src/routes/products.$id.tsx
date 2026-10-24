import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductGrid, Stars } from "@/components/site/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { discountPct, formatIDR, getProduct, PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — ${loaderData.product.brand} | KashaShoop` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} | KashaShoop` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Produk tidak tersedia | KashaShoop" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

const REVIEWS = [
  { name: "Nadia P.", rating: 5, text: "Teksturnya ringan dan cepat meresap. Repurchase terus!" },
  { name: "Rara A.", rating: 4, text: "Cocok di kulitku, hasilnya mulai terlihat setelah 2 minggu." },
  { name: "Salsa K.", rating: 5, text: "Packaging cantik, pengiriman cepat. Suka banget." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const d = discountPct(product);
  const related = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);
  const out = product.stock === 0;

  return (
    <div className="container-k py-8">
      <p className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Beranda</Link> / <Link to="/products" search={{ category: [product.category] }} className="hover:text-primary">{product.category}</Link> / {product.name}
      </p>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border bg-muted">
            <img key={img} src={product.images[img]} alt={product.name} width={816} height={816} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/products" search={{ brand: [product.brand] }} className="text-xs font-bold uppercase tracking-wider text-primary">{product.brand}</Link>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">{product.name}</h1>
          <div className="mt-3"><Stars rating={product.rating} reviews={product.reviews} /></div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatIDR(product.price)}</span>
            {product.originalPrice && <span className="text-muted-foreground line-through">{formatIDR(product.originalPrice)}</span>}
            {d > 0 && <span className="rounded-md bg-blush px-2 py-0.5 text-xs font-bold text-blush-foreground">Hemat {d}%</span>}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted p-3"><dt className="text-xs text-muted-foreground">Ukuran</dt><dd className="font-semibold">{product.size}</dd></div>
            <div className="rounded-lg bg-muted p-3"><dt className="text-xs text-muted-foreground">Stok</dt><dd className={`font-semibold ${out ? "text-destructive" : "text-success"}`}>{out ? "Habis" : `Tersedia (${product.stock})`}</dd></div>
          </dl>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Jumlah</span>
            <div className="flex items-center rounded-full border">
              <button aria-label="Kurangi" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button aria-label="Tambah" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} className="grid h-10 w-10 place-items-center"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" variant="hero" disabled={out} onClick={() => addToCart(product.id, qty)}>Tambah ke Keranjang</Button>
            <Button size="lg" disabled={out} onClick={() => { addToCart(product.id, qty); navigate({ to: "/checkout" }); }}>Beli Sekarang</Button>
            <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" className="grid h-11 w-11 place-items-center rounded-full border hover:border-primary hover:text-primary">
              <Heart className={`h-5 w-5 ${inWishlist(product.id) ? "fill-primary text-primary" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="desc" className="mt-14">
        <TabsList>
          <TabsTrigger value="desc">Deskripsi</TabsTrigger>
          <TabsTrigger value="use">Cara Pakai</TabsTrigger>
          <TabsTrigger value="reviews">Ulasan ({REVIEWS.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="max-w-3xl pt-4 text-sm leading-relaxed text-muted-foreground">
          {product.description} Cocok untuk penggunaan sehari-hari. Kategori: {product.category}. Ukuran: {product.size}.
        </TabsContent>
        <TabsContent value="use" className="max-w-3xl pt-4 text-sm leading-relaxed text-muted-foreground">
          Gunakan pada kulit yang bersih. Aplikasikan secukupnya dan ratakan dengan lembut. Gunakan secara rutin untuk hasil terbaik. Hentikan pemakaian jika terjadi iritasi.
        </TabsContent>
        <TabsContent value="reviews" className="pt-4">
          <p className="mb-4 text-xs text-muted-foreground">Ulasan berikut adalah data contoh untuk demo.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-xl border p-5">
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-star text-star" : "text-border"}`} />)}</div>
                <p className="mt-3 text-sm">{r.text}</p>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">{r.name}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-3xl font-semibold">Produk Serupa</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
