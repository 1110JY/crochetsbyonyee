-- Add fields for customer reviews submitted via the review form
alter table "public"."testimonials" 
add column if not exists "email" text,
add column if not exists "title" text,
add column if not exists "image_urls" text[],
add column if not exists "source" text default 'admin' check (source in ('admin', 'customer_review'));

-- Update the testimonials table to make reviews unpublished by default when submitted by customers
alter table "public"."testimonials" 
alter column "is_published" set default false;

-- Create index for email (for potential future contact)
create index if not exists "testimonials_email_idx" on "public"."testimonials" ("email");
create index if not exists "testimonials_source_idx" on "public"."testimonials" ("source");

-- Update RLS policies to allow anonymous review submissions
create policy "Enable insert for customer reviews" on "public"."testimonials"
  for insert with check (source = 'customer_review');
