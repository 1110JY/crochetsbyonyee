-- Remove all RLS policies and disable RLS for public tables to fix infinite recursion
-- This script completely removes the circular reference issues

-- Disable RLS entirely for public tables that should be readable by everyone
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Testimonials are publicly readable" ON public.testimonials;
DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
DROP POLICY IF EXISTS "Content pages are publicly readable" ON public.content_pages;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can manage content pages" ON public.content_pages;

-- Keep RLS only for sensitive data (profiles and contact inquiries)
-- But simplify the policies to avoid recursion

-- Drop existing profile policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;

-- Create simple profile policies without circular references
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- For contact inquiries, keep simple policies
DROP POLICY IF EXISTS "Contact inquiries are private" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Admin can manage contact inquiries" ON public.contact_inquiries;

-- Create simple contact inquiry policies
CREATE POLICY "Users can insert contact inquiries" ON public.contact_inquiries
    FOR INSERT WITH CHECK (true);

-- Grant public access to tables that should be publicly readable
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT ON public.content_pages TO anon, authenticated;

-- Grant insert access for contact inquiries
GRANT INSERT ON public.contact_inquiries TO anon, authenticated;

-- Ensure the tables are accessible
GRANT USAGE ON SCHEMA public TO anon, authenticated;
