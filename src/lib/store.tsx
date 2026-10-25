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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const applySession = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) { setUser(null); setUserId(null); return; }
      setUserId(u.id);
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle();
      setUser({ name: profile?.full_name || u.email?.split("@")[0] || "Pengguna", email: u.email ?? "" });
      // Merge remote cart with any local guest cart, then persist the merge.
      const { data: remote } = await supabase.from("cart_items").select("product_id, qty").eq("user_id", u.id);
      const remoteItems: CartItem[] = (remote ?? []).map((r) => ({ id: r.product_id, qty: r.qty }));
      setCart((local) => {
        const merged = [...remoteItems];
        for (const li of local) {
          const ex = merged.find((m) => m.id === li.id);
          const max = getProduct(li.id)?.stock ?? 99;
          if (ex) ex.qty = Math.min(max, ex.qty + li.qty);
          else merged.push({ id: li.id, qty: Math.min(max, li.qty) });
        }
        if (merged.length)
          void supabase.from("cart_items").upsert(merged.map((m) => ({ user_id: u.id, product_id: m.id, qty: m.qty })));
        return merged;
      });
    };
    applySession();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") applySession();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const syncUpsert = (id: string, qty: number) => {
    if (userId) void supabase.from("cart_items").upsert({ user_id: userId, product_id: id, qty });
  };
  const syncDelete = (id: string) => {
    if (userId) void supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", id);
  };

  const addToCart = (id: string, qty = 1) => {
    const pr = getProduct(id);
    if (!pr || pr.stock === 0) { toast.error("Stok produk habis"); return; }
    const ex = cart.find((i) => i.id === id);
    const nextQty = Math.min(pr.stock, (ex?.qty ?? 0) + qty);
    setCart((c) => {
      const e = c.find((i) => i.id === id);
      if (e) return c.map((i) => (i.id === id ? { ...i, qty: Math.min(pr.stock, i.qty + qty) } : i));
      return [...c, { id, qty: Math.min(pr.stock, qty) }];
    });
    syncUpsert(id, nextQty);
    toast.success("Ditambahkan ke keranjang", { description: pr.name });
  };
  const setQty = (id: string, qty: number) => {
    const max = getProduct(id)?.stock ?? 99;
    const next = Math.min(max, qty);
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: next } : i))));
    if (qty <= 0) syncDelete(id);
    else syncUpsert(id, next);
  };
  const removeFromCart = (id: string) => {
    setCart((c) => c.filter((i) => i.id !== id));
    syncDelete(id);
  };
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
      clearCart: () => {
        setCart([]);
        if (userId) void supabase.from("cart_items").delete().eq("user_id", userId);
      },
      toggleWishlist, inWishlist: (id) => wishlist.includes(id), setUser,
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
