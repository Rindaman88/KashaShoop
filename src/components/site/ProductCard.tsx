import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { discountPct, formatIDR, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-star text-star" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews != null && <span>({reviews.toLocaleString("id-ID")})</span>}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const d = discountPct(product);
  const liked = inWishlist(product.id);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-card">
      <Link to="/products/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <img src={product.images[0]} alt={product.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {d > 0 && <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">-{d}%</span>}
        {product.stock === 0 && <span className="absolute inset-x-0 bottom-0 bg-foreground/70 py-1.5 text-center text-xs font-semibold text-background">Stok Habis</span>}
      </Link>
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={liked ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-sm hover:text-primary"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-3 md:p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{product.brand}</span>
        <Link to="/products/$id" params={{ id: product.id }} className="line-clamp-2 min-h-10 text-sm font-medium leading-snug hover:text-primary">{product.name}</Link>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="mt-auto pt-1">
          {product.originalPrice && <div className="text-xs text-muted-foreground line-through">{formatIDR(product.originalPrice)}</div>}
          <div className="font-bold text-primary">{formatIDR(product.price)}</div>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          disabled={product.stock === 0}
          className="mt-2 inline-flex h-9 items-center justify-center gap-2 rounded-full border border-primary text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> {product.stock === 0 ? "Stok Habis" : "Tambah"}
        </button>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export function SectionTitle({ title, subtitle, link }: { title: string; subtitle?: string; link?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl font-semibold md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {link}
    </div>
  );
}
