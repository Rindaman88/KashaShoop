-- Profiles (linked to auth users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.categories (name, slug) VALUES
  ('Skincare', 'skincare'), ('Makeup', 'makeup'), ('Sunscreen', 'sunscreen'),
  ('Serum', 'serum'), ('Cleanser', 'cleanser'), ('Moisturizer', 'moisturizer'),
  ('Haircare', 'haircare'), ('Bodycare', 'bodycare'), ('Parfum', 'parfum');

-- Products
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0),
  original_price INTEGER CHECK (original_price >= 0),
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  size TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.products (id, category_id, name, brand, description, price, original_price, rating, reviews, stock, size, tags) VALUES
  ('niacinamide-brightening-serum', (SELECT id FROM public.categories WHERE slug='serum'), 'Niacinamide 10% Brightening Serum', 'SOMETHINC', 'Serum ringan dengan niacinamide 10% untuk membantu meratakan warna kulit, menyamarkan noda, dan menjaga skin barrier.', 89000, 115000, 4.8, 2140, 42, '20 ml', '{best,promo}'),
  ('hydrasoothe-sunscreen-gel', (SELECT id FROM public.categories WHERE slug='sunscreen'), 'Hydrasoothe Sunscreen Gel SPF 45', 'Azarine', 'Sunscreen bertekstur gel yang ringan, cepat meresap, tanpa whitecast, cocok untuk kulit berminyak dan berjerawat.', 65000, NULL, 4.9, 5310, 120, '50 ml', '{best}'),
  ('5x-ceramide-barrier-moisturizer', (SELECT id FROM public.categories WHERE slug='moisturizer'), '5X Ceramide Barrier Repair Moisturizer', 'SKINTIFIC', 'Pelembap gel dengan 5 jenis ceramide untuk memperbaiki skin barrier dan menjaga kelembapan hingga 24 jam.', 129000, 169000, 4.8, 3870, 18, '30 g', '{best,promo}'),
  ('superstay-matte-ink', (SELECT id FROM public.categories WHERE slug='makeup'), 'Superstay Matte Ink Lipstick', 'Maybelline', 'Lipstik matte tahan lama hingga 16 jam dengan warna intens dan tidak mudah transfer.', 119000, 149000, 4.7, 1920, 60, '5 ml', '{best,promo}'),
  ('low-ph-good-morning-cleanser', (SELECT id FROM public.categories WHERE slug='cleanser'), 'Low pH Good Morning Gel Cleanser', 'COSRX', 'Pembersih wajah ber-pH rendah dengan tea tree oil dan BHA untuk membersihkan tanpa membuat kulit kering.', 105000, NULL, 4.7, 2760, 35, '150 ml', '{best}'),
  ('lightening-day-cream', (SELECT id FROM public.categories WHERE slug='skincare'), 'Lightening Day Cream SPF 30', 'Wardah', 'Krim siang dengan perlindungan SPF 30 untuk membantu mencerahkan dan melembapkan kulit.', 42000, 52000, 4.6, 4100, 80, '30 g', '{best,promo}'),
  ('snail-mucin-essence', (SELECT id FROM public.categories WHERE slug='serum'), 'Advanced Snail 96 Mucin Essence', 'COSRX', 'Essence dengan 96% snail secretion filtrate untuk menghidrasi dan membantu regenerasi kulit.', 189000, NULL, 4.9, 6200, 25, '100 ml', '{best}'),
  ('ceramide-gentle-cleanser', (SELECT id FROM public.categories WHERE slug='cleanser'), 'Ceramide Gentle Foam Cleanser', 'SKINTIFIC', 'Foam cleanser lembut dengan ceramide dan amino acid, cocok untuk kulit sensitif.', 79000, NULL, 4.6, 1430, 50, '120 ml', '{best}'),
  ('bakuchiol-night-serum', (SELECT id FROM public.categories WHERE slug='serum'), 'Bakuchiol Night Renewal Serum', 'SOMETHINC', 'Serum malam dengan bakuchiol sebagai alternatif retinol yang lembut untuk menyamarkan garis halus.', 135000, NULL, 4.7, 320, 30, '20 ml', '{new}'),
  ('blush-bloom-eau-de-parfum', (SELECT id FROM public.categories WHERE slug='parfum'), 'Blush Bloom Eau de Parfum', 'Wardah', 'Parfum dengan aroma floral peony dan musk yang lembut, feminin, dan tahan lama.', 159000, 199000, 4.5, 210, 15, '50 ml', '{new,promo}'),
  ('silky-repair-shampoo', (SELECT id FROM public.categories WHERE slug='haircare'), 'Silky Repair Shampoo', 'Wardah', 'Shampoo dengan argan oil dan keratin untuk rambut lembut, berkilau, dan mudah diatur.', 38000, NULL, 4.5, 880, 90, '170 ml', '{new}'),
  ('glow-body-serum-lotion', (SELECT id FROM public.categories WHERE slug='bodycare'), 'Glow Body Serum Lotion', 'Azarine', 'Body lotion bertekstur serum dengan niacinamide dan vitamin C untuk kulit tubuh cerah merata.', 55000, 69000, 4.6, 540, 70, '250 ml', '{new,promo}'),
  ('fit-me-cushion', (SELECT id FROM public.categories WHERE slug='makeup'), 'Fit Me Matte Cushion', 'Maybelline', 'Cushion dengan hasil akhir matte natural dan kontrol minyak hingga 12 jam.', 139000, NULL, 4.4, 760, 0, '14 g', '{new}'),
  ('mugwort-clay-mask', (SELECT id FROM public.categories WHERE slug='skincare'), 'Mugwort Pore Clarifying Clay Mask', 'SKINTIFIC', 'Masker clay dengan mugwort untuk membersihkan pori dan menenangkan kulit kemerahan.', 99000, NULL, 4.7, 1230, 40, '55 g', '{new}'),
  ('uv-shield-sunscreen-mist', (SELECT id FROM public.categories WHERE slug='sunscreen'), 'UV Shield Sunscreen Mist SPF 50', 'SOMETHINC', 'Sunscreen spray praktis untuk re-apply di atas makeup sepanjang hari.', 98000, 125000, 4.5, 640, 33, '100 ml', '{promo}'),
  ('hydrating-aloe-moisturizer', (SELECT id FROM public.categories WHERE slug='moisturizer'), 'Hydrating Aloe Water Moisturizer', 'Azarine', 'Pelembap water-gel dengan aloe vera dan hyaluronic acid untuk hidrasi instan tanpa lengket.', 48000, NULL, 4.6, 990, 65, '40 ml', '{}');

-- Cart items (per signed-in user)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own cart" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add to own cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own cart" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own cart items" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','completed','cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);