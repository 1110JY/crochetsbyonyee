-- Create storage bucket for review images
-- This will store customer uploaded images for reviews

-- Create the review-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow anyone to upload images (for anonymous reviews)
CREATE POLICY "Allow public upload of review images" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'review-images');

-- Create storage policy to allow public read access to review images
CREATE POLICY "Allow public read access to review images" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'review-images');

-- Create storage policy to allow admin to delete review images
CREATE POLICY "Allow admin to delete review images" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'review-images' AND auth.role() = 'authenticated');
