-- Add reply columns to contact_inquiries table
alter table if exists "public"."contact_inquiries" 
  add column if not exists "reply" text,
  add column if not exists "replied_at" timestamp with time zone;
