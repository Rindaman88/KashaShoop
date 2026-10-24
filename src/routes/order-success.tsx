import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/products";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Pesanan Berhasil — KashaShoop" },
      { name: "description", content: "Konfirmasi pesanan simulasi di KashaShoop." },
      { property: "og:title", content: "Pesanan Berhasil — KashaShoop" },
      { property: "og:description", content: "Terima kasih telah berbelanja di KashaShoop." },
    ],
  }),
  component: Success,
});

function Success() {
  const [o, setO] = useState<{ orderId: string; name: string; total: number; payment: string } | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("kasha-last-order");
    if (raw) setO(JSON.parse(raw));
  }, []);
  return (
    <div className="container-k py-20 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-5 font-display text-4xl font-semibold">Terima kasih{o ? `, ${o.name}` : ""}!</h1>
      <p className="mt-2 text-muted-foreground">Pesanan simulasi kamu telah kami terima.</p>
      {o && (
        <div className="mx-auto mt-8 max-w-sm space-y-2 rounded-2xl border p-6 text-left text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">No. Pesanan</span><span className="font-semibold">{o.orderId}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Pembayaran</span><span>{o.payment}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">{formatIDR(o.total)}</span></div>
        </div>
      )}
      <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">Ini adalah demo. Tidak ada transaksi atau pembayaran nyata yang terjadi.</p>
      <Button size="lg" className="mt-6" asChild><Link to="/products">Lanjut Belanja</Link></Button>
    </div>
  );
}
