-- Make sure is_read column exists and has proper default value
alter table if exists "public"."contact_inquiries" 
  add column if not exists "is_read" boolean not null default false;
