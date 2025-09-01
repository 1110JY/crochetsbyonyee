-- Fix RLS policies to prevent infinite recursion
-- Drop existing policies that cause circular references
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Public read access for products" ON products;
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON profiles;

-- Create simpler policies without circular references
-- Categories: Allow public read access, admin write access
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                SELECT email FROM auth.users 
                WHERE auth.users.id = auth.uid()
                AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
            )
        )
    );

-- Products: Allow public read access, admin write access
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Profiles: Simple user access without circular references
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow profile creation" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Site settings: Public read, admin write
CREATE POLICY "Allow public read access to site_settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to site_settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Testimonials: Public read, admin write
CREATE POLICY "Allow public read access to testimonials" ON testimonials
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow admin full access to testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Contact inquiries: Admin only access
CREATE POLICY "Allow admin access to contact_inquiries" ON contact_inquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- Allow anyone to insert contact inquiries
CREATE POLICY "Allow public insert to contact_inquiries" ON contact_inquiries
    FOR INSERT WITH CHECK (true);
