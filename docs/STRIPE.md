# Stripe Checkout + Webhook Setup

This document explains how to test the Stripe Checkout flow and webhook locally.

1. Ensure env variables are set in `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (from stripe listen)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

2. Run the app:

```powershell
npm run dev
```

3. Start Stripe CLI and forward webhooks:

```powershell
stripe login
stripe listen --forward-to http://localhost:3001/api/stripe/webhook
```

Copy the `Webhook signing secret` shown by `stripe listen` into `STRIPE_WEBHOOK_SECRET`.

4. Trigger a test checkout (use the `StripeCheckoutButton` component, or POST to `/api/stripe/checkout`).

5. Complete the Checkout (test card: `4242 4242 4242 4242`).

6. Verify:
- Check Stripe CLI logs for forwarded events
- Check Next.js server logs for webhook processing
- Check Supabase `orders` and `order_items` tables for the inserted records
- View admin UI: `/admin/orders` and click an order for details

7. Troubleshooting:
- If the webhook signature verification fails, re-run `stripe listen` and update `STRIPE_WEBHOOK_SECRET`.
- If DB inserts fail, confirm `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are correct and that the `orders` tables exist.

---

If you want, I can also:
- Add idempotency logging email notifications
- Automatically create the `orders` tables via Supabase REST API (needs elevated permissions)
- Add an email confirmation flow using `resend`
