-- Enable RLS
alter table if exists "public"."testimonials" enable row level security;

-- Create testimonials table
create table if not exists "public"."testimonials" (
  "id" uuid not null default uuid_generate_v4(),
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "customer_name" text not null,
  "content" text not null,
  "rating" integer not null default 5,
  "is_featured" boolean default false,
  "is_published" boolean default true,
  constraint "testimonials_pkey" primary key ("id")
);

-- Create RLS policies
create policy "Enable read access for all users" on "public"."testimonials"
  for select using (true);

create policy "Enable insert for authenticated users only" on "public"."testimonials"
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for admin users only" on "public"."testimonials"
  for update using (auth.role() = 'admin')
  with check (auth.role() = 'admin');

create policy "Enable delete for admin users only" on "public"."testimonials"
  for delete using (auth.role() = 'admin');

-- Grant necessary privileges
grant usage on schema "public" to "anon";
grant usage on schema "public" to "authenticated";
grant usage on schema "public" to "service_role";

grant all on "public"."testimonials" to "anon";
grant all on "public"."testimonials" to "authenticated";
grant all on "public"."testimonials" to "service_role";

-- Create an index for faster sorting
create index if not exists "testimonials_created_at_idx" on "public"."testimonials" ("created_at" desc);
create index if not exists "testimonials_is_featured_idx" on "public"."testimonials" ("is_featured");
