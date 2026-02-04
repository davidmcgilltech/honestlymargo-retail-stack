-- HonestlyMargoRetail™ Database Schema
-- Supabase Postgres

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  inventory_count INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (for different scents, colors, sizes)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10, 2),
  inventory_count INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  shipping_address JSONB,
  subtotal DECIMAL(10, 2),
  shipping DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart recovery (for abandoned cart emails)
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  cart_data JSONB,
  recovered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reminded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);

-- ============================================
-- SEED DATA: Honestly Margo Products
-- ============================================

INSERT INTO products (name, slug, description, price, image_url, category, tags) VALUES
(
  'Tinted Lip Balms',
  'tinted-lip-balms',
  'Our best-selling tinted lip balms deliver beautiful, buildable color while nourishing your lips with natural ingredients. Available in 6 gorgeous shades that complement every skin tone.',
  7.95,
  'https://honestlymargo.com/cdn/shop/products/tinted-lip-balm.jpg',
  'Lip Care',
  ARRAY['best-seller', 'lip-balm', 'tinted']
),
(
  'Aromatherapy Balms',
  'aromatherapy-balms',
  'Multi-purpose aromatherapy balms crafted with essential oils to soothe, calm, and uplift. Perfect for temples, pulse points, and anywhere you need a moment of zen.',
  11.95,
  'https://honestlymargo.com/cdn/shop/products/aromatherapy-balm.jpg',
  'Body Care',
  ARRAY['best-seller', 'aromatherapy', 'balm']
),
(
  'Roller Girl Roll-On Lip Gloss',
  'roller-girl-lip-gloss',
  'Fun, fruity roll-on lip gloss that goes on smooth and leaves a gorgeous shine. Perfect for teens and tweens (and adults who love a playful vibe).',
  12.00,
  'https://honestlymargo.com/cdn/shop/products/roller-girl-gloss.jpg',
  'Lip Care',
  ARRAY['best-seller', 'lip-gloss', 'roll-on']
),
(
  'Hand & Body Lotion',
  'hand-body-lotion',
  'Luxuriously creamy hand and body lotion that absorbs quickly without greasy residue. Infused with nourishing botanicals and available in our signature scents.',
  16.95,
  'https://honestlymargo.com/cdn/shop/products/hand-body-lotion.jpg',
  'Body Care',
  ARRAY['lotion', 'moisturizer', 'hand-cream']
),
(
  'Body Wash',
  'body-wash',
  'Gentle, sulfate-free body wash that cleanses without stripping your skin. Leaves you feeling fresh, soft, and lightly scented.',
  16.95,
  'https://honestlymargo.com/cdn/shop/products/body-wash.jpg',
  'Body Care',
  ARRAY['body-wash', 'cleanser']
),
(
  'Aromatherapy Shower Mist',
  'aromatherapy-shower-mist',
  'Transform your shower into a spa experience. Spray this essential oil mist into your steamy shower and breathe deep for instant aromatherapy benefits.',
  18.95,
  'https://honestlymargo.com/cdn/shop/products/shower-mist.jpg',
  'Aromatherapy',
  ARRAY['aromatherapy', 'shower', 'mist']
),
(
  'Goddess Illuminating Body Lotion',
  'goddess-body-lotion',
  'Our signature Goddess scent in a luxurious illuminating body lotion. Leaves skin glowing, hydrated, and delicately scented with notes of jasmine and vanilla.',
  22.95,
  'https://honestlymargo.com/cdn/shop/products/goddess-lotion.jpg',
  'Body Care',
  ARRAY['trending', 'goddess', 'lotion', 'illuminating']
),
(
  'Goddess Hair & Body Mist',
  'goddess-hair-body-mist',
  'A lightweight, refreshing mist for hair and body. Our intoxicating Goddess scent lingers all day without being overpowering.',
  22.95,
  'https://honestlymargo.com/cdn/shop/products/goddess-mist.jpg',
  'Body Care',
  ARRAY['trending', 'goddess', 'mist', 'hair']
),
(
  'Whipped Body Soap',
  'whipped-body-soap',
  'Cloud-like whipped soap that transforms your shower routine. Rich, creamy lather that cleanses and moisturizes in one luxurious step.',
  22.95,
  'https://honestlymargo.com/cdn/shop/products/whipped-soap.jpg',
  'Body Care',
  ARRAY['soap', 'whipped', 'cleanser']
),
(
  'Goddess Roll On Fragrance',
  'goddess-roll-on-fragrance',
  'Take our signature Goddess scent anywhere with this convenient roll-on perfume oil. Long-lasting, travel-friendly, and absolutely divine.',
  24.95,
  'https://honestlymargo.com/cdn/shop/products/goddess-roll-on.jpg',
  'Fragrance',
  ARRAY['goddess', 'fragrance', 'roll-on', 'perfume']
);

-- Add some variants for the tinted lip balms
INSERT INTO product_variants (product_id, name, sku, inventory_count)
SELECT id, 'Berry Bliss', 'TLB-BERRY', 50 FROM products WHERE slug = 'tinted-lip-balms'
UNION ALL
SELECT id, 'Coral Crush', 'TLB-CORAL', 50 FROM products WHERE slug = 'tinted-lip-balms'
UNION ALL
SELECT id, 'Pink Petal', 'TLB-PINK', 50 FROM products WHERE slug = 'tinted-lip-balms'
UNION ALL
SELECT id, 'Nude Natural', 'TLB-NUDE', 50 FROM products WHERE slug = 'tinted-lip-balms'
UNION ALL
SELECT id, 'Rose Romance', 'TLB-ROSE', 50 FROM products WHERE slug = 'tinted-lip-balms'
UNION ALL
SELECT id, 'Mauve Magic', 'TLB-MAUVE', 50 FROM products WHERE slug = 'tinted-lip-balms';
