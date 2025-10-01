-- Migration: create product_prices table
-- Run this against your Supabase/Postgres database to store Stripe Price IDs per product and currency

CREATE TABLE IF NOT EXISTS product_prices (
  product_id uuid NOT NULL,
  currency text NOT NULL,
  stripe_price_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (product_id, currency)
);

-- Optional index for quick lookup by stripe_price_id
CREATE INDEX IF NOT EXISTS idx_product_prices_stripe_price_id ON product_prices (stripe_price_id);
