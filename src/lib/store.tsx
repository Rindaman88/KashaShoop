import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProduct } from "./products";

type CartItem = { id: string; qty: number };
type User = { name: string; email: string } | null;

type Store = {
  cart: CartItem[];
  wishlist: string[];
  user: User;
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  setUser: (u: User) => void;
};

const Ctx = createContext<Store | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(v));
  }, [key, v, ready]);
  return [v, setV] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartItem[]>("kasha-cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("kasha-wishlist", []);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const applySession = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) { setUser(null); return; }
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle();
      setUser({ name: profile?.full_name || u.email?.split("@")[0] || "Pengguna", email: u.email ?? "" });
    };
    applySession();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") applySession();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const addToCart = (id: string, qty = 1) => {
    const pr = getProduct(id);
    if (!pr || pr.stock === 0) { toast.error("Stok produk habis"); return; }
    setCart((c) => {
      const ex = c.find((i) => i.id === id);
      if (ex) return c.map((i) => (i.id === id ? { ...i, qty: Math.min(pr.stock, i.qty + qty) } : i));
      return [...c, { id, qty: Math.min(pr.stock, qty) }];
    });
    toast.success("Ditambahkan ke keranjang", { description: pr.name });
  };
  const setQty = (id: string, qty: number) => {
    const max = getProduct(id)?.stock ?? 99;
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(max, qty) } : i))));
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.id !== id));
  const toggleWishlist = (id: string) => {
    const has = wishlist.includes(id);
    setWishlist((w) => (has ? w.filter((x) => x !== id) : [...w, id]));
    toast(has ? "Dihapus dari wishlist" : "Disimpan ke wishlist");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + (getProduct(i.id)?.price ?? 0) * i.qty, 0);

  return (
    <Ctx.Provider value={{
      cart, wishlist, user, cartCount, subtotal, addToCart, setQty, removeFromCart,
      clearCart: () => setCart([]), toggleWishlist, inWishlist: (id) => wishlist.includes(id), setUser,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
