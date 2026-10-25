import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkoutTotals, formatIDR, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — KashaShoop" },
      { name: "description", content: "Lengkapi data pengiriman dan pilih metode pembayaran (simulasi)." },
      { property: "og:title", content: "Checkout — KashaShoop" },
      { property: "og:description", content: "Selesaikan pesananmu di KashaShoop." },
    ],
  }),
  component: Checkout,
});

const PAYMENTS = ["Transfer Bank (Virtual Account)", "E-Wallet (GoPay / OVO / DANA)", "Bayar di Tempat (COD)"];
type Form = { name: string; phone: string; email: string; address: string; city: string; postal: string; payment: string };

export function validateCheckout(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 3) e.name = "Nama lengkap minimal 3 karakter";
  if (!/^(\+62|62|0)8\d{7,11}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Nomor HP tidak valid (contoh: 081234567890)";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email tidak valid";
  if (f.address.trim().length < 10) e.address = "Alamat minimal 10 karakter";
  if (f.city.trim().length < 2) e.city = "Kota wajib diisi";
  if (!/^\d{5}$/.test(f.postal)) e.postal = "Kode pos harus 5 digit";
  if (!f.payment) e.payment = "Pilih metode pembayaran";
  return e;
}

function Checkout() {
  const { cart, subtotal, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState<Form>({ name: user?.name ?? "", phone: "", email: user?.email ?? "", address: "", city: "", postal: "", payment: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState("");
  const [placing, setPlacing] = useState(false);
  const { shipping, discount, total } = checkoutTotals(subtotal, applied);

  if (cart.length === 0)
    return (
      <div className="container-k py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Keranjangmu kosong</h1>
        <Button size="lg" className="mt-6" asChild><Link to="/products">Mulai Belanja</Link></Button>
      </div>
    );

  if (!user)
    return (
      <div className="container-k py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Masuk untuk melanjutkan checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pesananmu akan tersimpan di akunmu.</p>
        <Button size="lg" className="mt-6" asChild><Link to="/login">Masuk / Daftar</Link></Button>
      </div>
    );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateCheckout(f);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setPlacing(true);
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData.user?.id;
    if (!uid) { setPlacing(false); toast.error("Sesi berakhir, silakan masuk kembali"); return; }
    const items = cart.map((i) => {
      const p = getProduct(i.id)!;
      return { product_id: i.id, name: p.name, brand: p.brand, price: p.price, qty: i.qty };
    });
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: uid, items, subtotal, shipping, discount, total, status: "pending" })
      .select("id")
      .single();
    setPlacing(false);
    if (error || !order) { toast.error("Gagal membuat pesanan, coba lagi"); return; }
    sessionStorage.setItem("kasha-last-order", JSON.stringify({ orderId: order.id.slice(0, 8).toUpperCase(), name: f.name, total, payment: f.payment }));
    clearCart();
    navigate({ to: "/order-success" });
  };

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input {...props} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={`mt-1 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary ${errors[k] ? "border-destructive" : "border-input"}`} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="container-k py-10">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ini adalah simulasi — tidak ada pembayaran nyata yang diproses.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border p-6">
            <h2 className="mb-4 font-semibold">Data Pengiriman</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Nama lengkap")}
              {field("phone", "Nomor HP", { inputMode: "tel" })}
              <div className="sm:col-span-2">{field("email", "Email", { type: "email" })}</div>
              <div className="sm:col-span-2">{field("address", "Alamat lengkap")}</div>
              {field("city", "Kota")}
              {field("postal", "Kode pos", { inputMode: "numeric", maxLength: 5 })}
            </div>
          </section>
          <section className="rounded-2xl border p-6">
            <h2 className="mb-4 font-semibold">Metode Pembayaran (Simulasi)</h2>
            <div className="space-y-2">
              {PAYMENTS.map((p) => (
                <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm ${f.payment === p ? "border-primary bg-blush" : ""}`}>
                  <input type="radio" name="payment" className="accent-primary" checked={f.payment === p} onChange={() => setF({ ...f, payment: p })} /> {p}
                </label>
              ))}
            </div>
            {errors.payment && <p className="mt-2 text-xs text-destructive">{errors.payment}</p>}
          </section>
        </div>
        <aside className="h-fit rounded-2xl border p-6">
          <h2 className="font-semibold">Ringkasan Pesanan</h2>
          <div className="mt-4 space-y-3">
            {cart.map((i) => {
              const p = getProduct(i.id)!;
              return (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <img src={p.images[0]} alt="" className="h-12 w-12 rounded-md object-cover" />
                  <div className="min-w-0 flex-1"><p className="line-clamp-1">{p.name}</p><p className="text-xs text-muted-foreground">x{i.qty}</p></div>
                  <span>{formatIDR(p.price * i.qty)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode promo (KASHA10)" className="h-10 flex-1 rounded-lg border border-input px-3 text-sm outline-none focus:border-primary" />
            <Button type="button" variant="soft" className="h-10" onClick={() => setApplied(code)}>Pakai</Button>
          </div>
          {applied && !discount && <p className="mt-1 text-xs text-destructive">Kode promo tidak valid</p>}
          <div className="mt-5 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ongkos kirim</span><span>{shipping ? formatIDR(shipping) : "Gratis"}</span></div>
            {discount > 0 && <div className="flex justify-between text-success"><span>Diskon (10%)</span><span>-{formatIDR(discount)}</span></div>}
            <div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span className="text-primary">{formatIDR(total)}</span></div>
          </div>
          <Button size="lg" type="submit" className="mt-6 w-full">Buat Pesanan</Button>
        </aside>
      </form>
    </div>
  );
}
