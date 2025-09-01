-- Enable storage
create extension if not exists "uuid-ossp";

-- Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public access to product images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own images
create policy "Users can update own images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and auth.uid() = owner
)
with check (
  bucket_id = 'product-images'
  and auth.uid() = owner
);

-- Allow authenticated users to delete their own images
create policy "Users can delete own images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and auth.uid() = owner
);
