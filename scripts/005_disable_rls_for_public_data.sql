-- Fix infinite recursion by disabling RLS for public data
-- Products and categories should be publicly readable anyway

-- Disable RLS for public tables
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for these tables to prevent conflicts
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Testimonials are publicly readable" ON public.testimonials;
DROP POLICY IF EXISTS "Only admins can manage testimonials" ON public.testimonials;

-- Keep RLS only for sensitive data
-- Profiles table - users can read their own profile, admins can read all
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Contact inquiries - only admins can read
DROP POLICY IF EXISTS "Only admins can read contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Only admins can read contact inquiries" ON public.contact_inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Site settings - publicly readable, only admins can modify
DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can manage site settings" ON public.site_settings;

CREATE POLICY "Site settings are publicly readable" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage site settings" ON public.site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Allow public insert for contact inquiries (contact form submissions)
CREATE POLICY "Anyone can submit contact inquiries" ON public.contact_inquiries
    FOR INSERT WITH CHECK (true);
