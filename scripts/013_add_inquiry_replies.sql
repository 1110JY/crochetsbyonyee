-- Add reply-related columns to contact_inquiries table
alter table "public"."contact_inquiries" 
  add column if not exists "replied" boolean default false,
  add column if not exists "replied_at" timestamp with time zone,
  add column if not exists "reply_message" text;
