-- Drop any existing updated_at trigger
drop trigger if exists set_updated_at on "public"."contact_inquiries";

-- Make sure all required columns exist with proper defaults
alter table if exists "public"."contact_inquiries" 
  add column if not exists "is_read" boolean not null default false,
  add column if not exists "updated_at" timestamp with time zone;

-- Add a trigger to automatically update the updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on "public"."contact_inquiries"
  for each row
  execute function public.set_updated_at();

-- Update any existing rows that have null updated_at
update "public"."contact_inquiries"
set updated_at = created_at
where updated_at is null;
