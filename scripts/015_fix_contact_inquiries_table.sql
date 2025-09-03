-- First, enable RLS on the table
alter table "public"."contact_inquiries" enable row level security;

-- Drop any existing policies to ensure clean slate
drop policy if exists "Allow admins full access to contact_inquiries" on "public"."contact_inquiries";

-- Create policy for admin access
create policy "Allow admins full access to contact_inquiries"
  on "public"."contact_inquiries"
  as permissive
  for all
  to authenticated
  using (
    exists (
      select 1 from "public"."profiles"
      where "public"."profiles"."id" = auth.uid()
      and "public"."profiles"."role" = 'admin'
    )
  )
  with check (
    exists (
      select 1 from "public"."profiles"
      where "public"."profiles"."id" = auth.uid()
      and "public"."profiles"."role" = 'admin'
    )
  );

-- Double check that is_read column exists and is properly set up
do $$ 
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'contact_inquiries' 
    and column_name = 'is_read'
  ) then
    alter table "public"."contact_inquiries" 
    add column "is_read" boolean not null default false;
  end if;
end $$;