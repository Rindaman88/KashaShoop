import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Akun Saya — KashaShoop" },
      { name: "description", content: "Kelola akun KashaShoop kamu." },
      { property: "og:title", content: "Akun Saya — KashaShoop" },
      { property: "og:description", content: "Profil akun KashaShoop." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user, wishlist, cartCount } = useStore();
  const navigate = useNavigate();
  if (!user)
    return (
      <div className="container-k py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Kamu belum masuk</h1>
        <Button size="lg" className="mt-6" asChild><Link to="/login">Masuk</Link></Button>
      </div>
    );
  return (
    <div className="container-k max-w-2xl py-12">
      <h1 className="font-display text-4xl font-semibold">Halo, {user.name}</h1>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link to="/wishlist" className="rounded-xl border p-5 hover:border-primary"><p className="text-2xl font-bold text-primary">{wishlist.length}</p><p className="text-sm">Wishlist</p></Link>
        <Link to="/cart" className="rounded-xl border p-5 hover:border-primary"><p className="text-2xl font-bold text-primary">{cartCount}</p><p className="text-sm">Item di keranjang</p></Link>
      </div>
      <Button variant="outline" className="mt-8" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>Keluar</Button>
    </div>
  );
}
