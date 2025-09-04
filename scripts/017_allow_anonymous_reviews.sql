-- Allow anonymous users to submit reviews (testimonials with is_published = false)
create policy "Enable anonymous review submission" on "public"."testimonials"
  for insert with check (is_published = false);

-- Drop the old restrictive policy if it exists
drop policy if exists "Enable insert for authenticated users only" on "public"."testimonials";
