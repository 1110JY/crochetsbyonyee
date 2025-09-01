-- Completely disable RLS for public tables and grant public access
-- Remove all existing policies that cause recursion
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow admin full access to products" ON products;
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials;

-- Disable RLS entirely for public tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Grant public read access to these tables
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON testimonials TO anon, authenticated;
GRANT SELECT ON site_settings TO anon, authenticated;

-- Keep RLS only for user-specific data
-- Profiles table (user-specific data)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
CREATE POLICY "Allow users to view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Contact inquiries (should be private)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anyone to insert contact inquiries" ON contact_inquiries;
CREATE POLICY "Allow anyone to insert contact inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
-- Only authenticated users can read their own inquiries (if needed later)

-- Content pages can be public for now
ALTER TABLE content_pages DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON content_pages TO anon, authenticated;

-- Insert some sample data if tables are empty
INSERT INTO categories (id, name, slug, description, image_url) VALUES
  (gen_random_uuid(), 'Baby Items', 'baby-items', 'Soft and cozy items for babies', '/soft-baby-crochet-blanket.png'),
  (gen_random_uuid(), 'Home Decor', 'home-decor', 'Beautiful decorative pieces for your home', '/elegant-crochet-home-decoration.png'),
  (gen_random_uuid(), 'Accessories', 'accessories', 'Stylish crochet accessories', '/stylish-crochet-accessories.png'),
  (gen_random_uuid(), 'Seasonal', 'seasonal', 'Seasonal decorations and items', '/seasonal-crochet-decorations.png'),
  (gen_random_uuid(), 'Custom Orders', 'custom-orders', 'Custom made-to-order items', '/custom-crochet-creations.png'),
  (gen_random_uuid(), 'Gift Sets', 'gift-sets', 'Perfect gift collections', '/crochet-gift-collection.png')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
WITH category_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (id, name, slug, description, price, category_id, is_featured, is_available, stock_quantity, materials, dimensions, care_instructions, images) 
SELECT 
  gen_random_uuid(),
  'Sample ' || c.slug || ' Item',
  'sample-' || c.slug || '-item',
  'Beautiful handcrafted ' || c.slug || ' made with love and attention to detail.',
  29.99,
  c.id,
  true,
  true,
  10,
  ARRAY['100% Cotton', 'Hypoallergenic'],
  '12" x 12"',
  'Hand wash cold, lay flat to dry',
  ARRAY['/crochet-item.png']
FROM category_ids c
ON CONFLICT (slug) DO NOTHING;
