-- Add optional columns to orders for session reference and Resend tracking
-- Run this in your Supabase SQL editor or via psql against your DB.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS session_reference text;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS resend_message_id text;

-- Optional: index for faster lookups by session_reference
CREATE INDEX IF NOT EXISTS idx_orders_session_reference ON public.orders(session_reference);

-- Optional: index on resend_message_id
CREATE INDEX IF NOT EXISTS idx_orders_resend_message_id ON public.orders(resend_message_id);
