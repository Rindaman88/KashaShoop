import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_MIN, formatIDR, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang Belanja — KashaShoop" },
      { name: "description", content: "Lihat dan atur produk di keranjang belanja KashaShoop." },
      { property: "og:title", content: "Keranjang — KashaShoop" },
      { property: "og:description", content: "Keranjang belanja produk kecantikanmu." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, removeFromCart, subtotal } = useStore();
  if (cart.length === 0)
    return (
      <div className="container-k py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">Keranjangmu masih kosong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Yuk, temukan produk kecantikan favoritmu.</p>
        <Button size="lg" className="mt-6" asChild><Link to="/products">Mulai Belanja</Link></Button>
      </div>
    );
  return (
    <div className="container-k py-10">
      <h1 className="font-display text-4xl font-semibold">Keranjang Belanja</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y rounded-2xl border">
          {cart.map((i) => {
            const p = getProduct(i.id);
            if (!p) return null;
            return (
              <div key={i.id} className="flex gap-4 p-4">
                <Link to="/products/$id" params={{ id: p.id }}><img src={p.images[0]} alt={p.name} className="h-24 w-24 rounded-lg object-cover" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                  <Link to="/products/$id" params={{ id: p.id }} className="line-clamp-2 text-sm font-medium hover:text-primary">{p.name}</Link>
                  <p className="text-xs text-muted-foreground">{formatIDR(p.price)} / pcs</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border">
                      <button aria-label="Kurangi" onClick={() => setQty(i.id, i.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                      <button aria-label="Tambah" onClick={() => setQty(i.id, i.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="font-bold text-primary">{formatIDR(p.price * i.qty)}</span>
                  </div>
                </div>
                <button aria-label="Hapus" onClick={() => removeFromCart(i.id)} className="grid h-8 w-8 place-items-center self-start rounded-full hover:bg-blush hover:text-primary"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
        <aside className="h-fit rounded-2xl border p-6">
          <h2 className="font-semibold">Ringkasan</h2>
          <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(subtotal)}</span></div>
          <p className="mt-2 text-xs text-muted-foreground">
            {subtotal >= FREE_SHIPPING_MIN ? "Kamu dapat gratis ongkir!" : `Belanja ${formatIDR(FREE_SHIPPING_MIN - subtotal)} lagi untuk gratis ongkir.`}
          </p>
          <div className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Total</span><span className="text-primary">{formatIDR(subtotal)}</span></div>
          <Button size="lg" className="mt-6 w-full" asChild><Link to="/checkout">Checkout</Link></Button>
          <Link to="/products" className="mt-3 block text-center text-sm text-primary hover:underline">Lanjut belanja</Link>
        </aside>
      </div>
    </div>
  );
}
