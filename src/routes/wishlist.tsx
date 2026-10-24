import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR, getProduct, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — KashaShoop" },
      { name: "description", content: "Produk kecantikan favorit yang kamu simpan di KashaShoop." },
      { property: "og:title", content: "Wishlist — KashaShoop" },
      { property: "og:description", content: "Simpan produk favoritmu dan belanja kapan saja." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as Product[];
  return (
    <div className="container-k py-10">
      <h1 className="font-display text-4xl font-semibold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} produk tersimpan</p>
      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-4 font-display text-2xl font-semibold">Wishlist masih kosong</p>
          <p className="mt-1 text-sm text-muted-foreground">Simpan produk favoritmu dengan menekan ikon hati.</p>
          <Button size="lg" className="mt-6" asChild><Link to="/products">Jelajahi Produk</Link></Button>
        </div>
      ) : (
        <div className="mt-8 divide-y rounded-2xl border">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <Link to="/products/$id" params={{ id: p.id }}><img src={p.images[0]} alt={p.name} className="h-20 w-20 rounded-lg object-cover" /></Link>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <Link to="/products/$id" params={{ id: p.id }} className="line-clamp-1 text-sm font-medium hover:text-primary">{p.name}</Link>
                <p className="mt-1 font-bold text-primary">{formatIDR(p.price)}</p>
              </div>
              <Button size="sm" disabled={p.stock === 0} onClick={() => { addToCart(p.id); toggleWishlist(p.id); }}>
                <ShoppingBag /> <span className="hidden sm:inline">Pindah ke Keranjang</span>
              </Button>
              <button aria-label="Hapus" onClick={() => toggleWishlist(p.id)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-blush hover:text-primary"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
