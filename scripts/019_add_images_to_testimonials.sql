-- Add images column to testimonials table for review attachments
-- This will store an array of image URLs uploaded to Supabase storage

-- Add images column to store array of image URLs
ALTER TABLE "public"."testimonials" 
ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}';

-- Add index for better performance when querying testimonials with images
CREATE INDEX IF NOT EXISTS "testimonials_images_idx" ON "public"."testimonials" USING GIN ("images");

-- Grant necessary privileges for the new column
GRANT SELECT, INSERT, UPDATE ON "public"."testimonials" TO "anon";
GRANT SELECT, INSERT, UPDATE ON "public"."testimonials" TO "authenticated";
GRANT ALL ON "public"."testimonials" TO "service_role";
