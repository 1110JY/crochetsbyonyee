-- 022_create_orders_table.sql
-- Creates orders and order_items tables for Stripe checkout fulfillment

BEGIN;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_reference text,
  stripe_session_id text UNIQUE,
  amount_total bigint,
  currency text,
  customer_email text,
  metadata jsonb,
  payment_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text,
  product_slug text,
  product_name text,
  description text,
  unit_amount bigint,
  quantity integer,
  currency text
);

COMMIT;
