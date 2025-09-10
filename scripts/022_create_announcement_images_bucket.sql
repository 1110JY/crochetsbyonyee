-- Create storage bucket for announcement images
insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do nothing;

-- Allow public access to announcement images
create policy "Public Access to Announcement Images"
on storage.objects for select
using ( bucket_id = 'announcement-images' );

-- Allow authenticated users (admins) to upload announcement images
create policy "Authenticated users can upload announcement images"
on storage.objects for insert
with check (
  bucket_id = 'announcement-images'
  and auth.role() = 'authenticated'
);

-- Allow authenticated users to update announcement images
create policy "Users can update announcement images"
on storage.objects for update
using (
  bucket_id = 'announcement-images'
  and auth.uid() = owner
)
with check (
  bucket_id = 'announcement-images'
  and auth.uid() = owner
);

-- Allow authenticated users to delete announcement images
create policy "Users can delete announcement images"
on storage.objects for delete
using (
  bucket_id = 'announcement-images'
  and auth.uid() = owner
);
