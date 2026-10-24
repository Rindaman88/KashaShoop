import serum from "@/assets/p-serum.jpg";
import sunscreen from "@/assets/p-sunscreen.jpg";
import lipstick from "@/assets/p-lipstick.jpg";
import cream from "@/assets/p-cream.jpg";
import cleanser from "@/assets/p-cleanser.jpg";
import perfume from "@/assets/p-perfume.jpg";
import hair from "@/assets/p-hair.jpg";

export type Category =
  | "Skincare" | "Makeup" | "Sunscreen" | "Serum" | "Cleanser"
  | "Moisturizer" | "Haircare" | "Bodycare" | "Parfum";

export const CATEGORIES: Category[] = [
  "Skincare", "Makeup", "Sunscreen", "Serum", "Cleanser",
  "Moisturizer", "Haircare", "Bodycare", "Parfum",
];

export const BRANDS = ["SOMETHINC", "Wardah", "Azarine", "SKINTIFIC", "Maybelline", "COSRX"];

export const CATEGORY_IMAGE: Record<Category, string> = {
  Skincare: cream, Makeup: lipstick, Sunscreen: sunscreen, Serum: serum,
  Cleanser: cleanser, Moisturizer: cream, Haircare: hair, Bodycare: hair, Parfum: perfume,
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  size: string;
  images: string[];
  description: string;
  tags: ("best" | "new" | "promo")[];
};

const p = (x: Product) => x;

export const PRODUCTS: Product[] = [
  p({ id: "niacinamide-brightening-serum", name: "Niacinamide 10% Brightening Serum", brand: "SOMETHINC", category: "Serum", price: 89000, originalPrice: 115000, rating: 4.8, reviews: 2140, stock: 42, size: "20 ml", images: [serum, cream], description: "Serum ringan dengan niacinamide 10% untuk membantu meratakan warna kulit, menyamarkan noda, dan menjaga skin barrier.", tags: ["best", "promo"] }),
  p({ id: "hydrasoothe-sunscreen-gel", name: "Hydrasoothe Sunscreen Gel SPF 45", brand: "Azarine", category: "Sunscreen", price: 65000, rating: 4.9, reviews: 5310, stock: 120, size: "50 ml", images: [sunscreen], description: "Sunscreen bertekstur gel yang ringan, cepat meresap, tanpa whitecast, cocok untuk kulit berminyak dan berjerawat.", tags: ["best"] }),
  p({ id: "5x-ceramide-barrier-moisturizer", name: "5X Ceramide Barrier Repair Moisturizer", brand: "SKINTIFIC", category: "Moisturizer", price: 129000, originalPrice: 169000, rating: 4.8, reviews: 3870, stock: 18, size: "30 g", images: [cream, serum], description: "Pelembap gel dengan 5 jenis ceramide untuk memperbaiki skin barrier dan menjaga kelembapan hingga 24 jam.", tags: ["best", "promo"] }),
  p({ id: "superstay-matte-ink", name: "Superstay Matte Ink Lipstick", brand: "Maybelline", category: "Makeup", price: 119000, originalPrice: 149000, rating: 4.7, reviews: 1920, stock: 60, size: "5 ml", images: [lipstick], description: "Lipstik matte tahan lama hingga 16 jam dengan warna intens dan tidak mudah transfer.", tags: ["best", "promo"] }),
  p({ id: "low-ph-good-morning-cleanser", name: "Low pH Good Morning Gel Cleanser", brand: "COSRX", category: "Cleanser", price: 105000, rating: 4.7, reviews: 2760, stock: 35, size: "150 ml", images: [cleanser], description: "Pembersih wajah ber-pH rendah dengan tea tree oil dan BHA untuk membersihkan tanpa membuat kulit kering.", tags: ["best"] }),
  p({ id: "lightening-day-cream", name: "Lightening Day Cream SPF 30", brand: "Wardah", category: "Skincare", price: 42000, originalPrice: 52000, rating: 4.6, reviews: 4100, stock: 80, size: "30 g", images: [cream], description: "Krim siang dengan perlindungan SPF 30 untuk membantu mencerahkan dan melembapkan kulit.", tags: ["best", "promo"] }),
  p({ id: "snail-mucin-essence", name: "Advanced Snail 96 Mucin Essence", brand: "COSRX", category: "Serum", price: 189000, rating: 4.9, reviews: 6200, stock: 25, size: "100 ml", images: [serum], description: "Essence dengan 96% snail secretion filtrate untuk menghidrasi dan membantu regenerasi kulit.", tags: ["best"] }),
  p({ id: "ceramide-gentle-cleanser", name: "Ceramide Gentle Foam Cleanser", brand: "SKINTIFIC", category: "Cleanser", price: 79000, rating: 4.6, reviews: 1430, stock: 50, size: "120 ml", images: [cleanser], description: "Foam cleanser lembut dengan ceramide dan amino acid, cocok untuk kulit sensitif.", tags: ["best"] }),
  p({ id: "bakuchiol-night-serum", name: "Bakuchiol Night Renewal Serum", brand: "SOMETHINC", category: "Serum", price: 135000, rating: 4.7, reviews: 320, stock: 30, size: "20 ml", images: [serum], description: "Serum malam dengan bakuchiol sebagai alternatif retinol yang lembut untuk menyamarkan garis halus.", tags: ["new"] }),
  p({ id: "blush-bloom-eau-de-parfum", name: "Blush Bloom Eau de Parfum", brand: "Wardah", category: "Parfum", price: 159000, originalPrice: 199000, rating: 4.5, reviews: 210, stock: 15, size: "50 ml", images: [perfume], description: "Parfum dengan aroma floral peony dan musk yang lembut, feminin, dan tahan lama.", tags: ["new", "promo"] }),
  p({ id: "silky-repair-shampoo", name: "Silky Repair Shampoo", brand: "Wardah", category: "Haircare", price: 38000, rating: 4.5, reviews: 880, stock: 90, size: "170 ml", images: [hair], description: "Shampoo dengan argan oil dan keratin untuk rambut lembut, berkilau, dan mudah diatur.", tags: ["new"] }),
  p({ id: "glow-body-serum-lotion", name: "Glow Body Serum Lotion", brand: "Azarine", category: "Bodycare", price: 55000, originalPrice: 69000, rating: 4.6, reviews: 540, stock: 70, size: "250 ml", images: [hair], description: "Body lotion bertekstur serum dengan niacinamide dan vitamin C untuk kulit tubuh cerah merata.", tags: ["new", "promo"] }),
  p({ id: "fit-me-cushion", name: "Fit Me Matte Cushion", brand: "Maybelline", category: "Makeup", price: 139000, rating: 4.4, reviews: 760, stock: 0, size: "14 g", images: [lipstick], description: "Cushion dengan hasil akhir matte natural dan kontrol minyak hingga 12 jam.", tags: ["new"] }),
  p({ id: "mugwort-clay-mask", name: "Mugwort Pore Clarifying Clay Mask", brand: "SKINTIFIC", category: "Skincare", price: 99000, rating: 4.7, reviews: 1230, stock: 40, size: "55 g", images: [cream], description: "Masker clay dengan mugwort untuk membersihkan pori dan menenangkan kulit kemerahan.", tags: ["new"] }),
  p({ id: "uv-shield-sunscreen-mist", name: "UV Shield Sunscreen Mist SPF 50", brand: "SOMETHINC", category: "Sunscreen", price: 98000, originalPrice: 125000, rating: 4.5, reviews: 640, stock: 33, size: "100 ml", images: [sunscreen], description: "Sunscreen spray praktis untuk re-apply di atas makeup sepanjang hari.", tags: ["promo"] }),
  p({ id: "hydrating-aloe-moisturizer", name: "Hydrating Aloe Water Moisturizer", brand: "Azarine", category: "Moisturizer", price: 48000, rating: 4.6, reviews: 990, stock: 65, size: "40 ml", images: [cream], description: "Pelembap water-gel dengan aloe vera dan hyaluronic acid untuk hidrasi instan tanpa lengket.", tags: [] }),
];

export const getProduct = (id: string) => PRODUCTS.find((x) => x.id === id);

export const formatIDR = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");

export const discountPct = (pr: Product) =>
  pr.originalPrice ? Math.round((1 - pr.price / pr.originalPrice) * 100) : 0;

export type CatalogFilters = {
  q?: string;
  category?: string[];
  brand?: string[];
  min?: number;
  max?: number;
  sort?: "low" | "high" | "rating";
  tag?: "best" | "new" | "promo";
};

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  const q = f.q?.trim().toLowerCase();
  let r = list.filter((x) => {
    if (q && !x.name.toLowerCase().includes(q) && !x.brand.toLowerCase().includes(q)) return false;
    if (f.category?.length && !f.category.includes(x.category)) return false;
    if (f.brand?.length && !f.brand.includes(x.brand)) return false;
    if (f.min != null && x.price < f.min) return false;
    if (f.max != null && x.price > f.max) return false;
    if (f.tag && !x.tags.includes(f.tag)) return false;
    return true;
  });
  if (f.sort === "low") r = [...r].sort((a, b) => a.price - b.price);
  if (f.sort === "high") r = [...r].sort((a, b) => b.price - a.price);
  if (f.sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
  return r;
}

export const SHIPPING_FEE = 15000;
export const FREE_SHIPPING_MIN = 200000;
export const PROMO_CODE = "KASHA10";

export function checkoutTotals(subtotal: number, code: string) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const discount = code.trim().toUpperCase() === PROMO_CODE ? Math.round(subtotal * 0.1) : 0;
  return { shipping, discount, total: subtotal + shipping - discount };
}
