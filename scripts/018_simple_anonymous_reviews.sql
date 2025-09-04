-- Simple fix: Allow anonymous users to insert unpublished testimonials
-- This will allow customer reviews to be submitted for admin review

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."testimonials";

-- Create a new policy that allows anyone to insert unpublished testimonials
CREATE POLICY "Allow anonymous review submission" ON "public"."testimonials"
  FOR INSERT 
  WITH CHECK (is_published = false);
