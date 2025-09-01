-- Completely remove problematic RLS policies and create simple ones
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow admin write access to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow admin write access to products" ON products;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin write access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin access to contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow public insert to contact_inquiries" ON contact_inquiries;

-- Create ultra-simple policies without any circular references
-- Categories: Public read access only
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

-- Products: Public read access only  
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

-- Site settings: Public read access only
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);

-- Testimonials: Public read for approved only
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (is_approved = true);

-- Contact inquiries: Allow public insert only
CREATE POLICY "contact_inquiries_public_insert" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Profiles: Basic user access
CREATE POLICY "profiles_user_access" ON profiles FOR ALL USING (auth.uid() = user_id);

-- For admin operations, we'll handle permissions in the application layer instead of RLS
-- This prevents infinite recursion issues
