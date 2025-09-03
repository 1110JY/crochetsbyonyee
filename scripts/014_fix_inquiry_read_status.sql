-- Add is_read column if it doesn't exist
alter table "public"."contact_inquiries"
  add column if not exists "is_read" boolean default false;

-- Update any existing NULL values to false
update "public"."contact_inquiries"
  set "is_read" = false
  where "is_read" is null;

-- Add a not null constraint
alter table "public"."contact_inquiries"
  alter column "is_read" set not null;
