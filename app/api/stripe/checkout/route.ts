import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/supabase/products'
import createServiceClient from '@/lib/supabase/service'
import { getRate } from '@/lib/exchange'

type CartItem = { id?: string; slug?: string; quantity: number }

export async function POST(req: Request) {
  try {
    // Runtime guard: ensure the Stripe secret key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set in the environment')
      return NextResponse.json({ error: 'Stripe secret key not configured on server' }, { status: 500 })
    }

    // Instantiate Stripe with the secret key at request time (safer for clearer errors)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-08-27.basil' })

  const body = await req.json()
  const { items, success_url, cancel_url, metadata, currency: rawCurrency } = body as { items: CartItem[]; success_url?: string; cancel_url?: string; metadata?: Record<string, string>; currency?: string }

    // Log incoming checkout request (useful for diagnosing 400 responses)
    try {
      console.info('Checkout request body:', { itemsCount: Array.isArray(items) ? items.length : 0, currency: rawCurrency })
    } catch (e) {
      // ignore logging errors
    }

    // Normalize and validate currency early so we return a clear error to the client
    const sessionCurrency = (typeof rawCurrency === 'string' && rawCurrency.trim() !== '' ? rawCurrency.trim().toUpperCase() : 'GBP')
    if (!/^[A-Z]{3}$/.test(sessionCurrency)) {
      console.warn('Invalid currency code provided to checkout:', rawCurrency)
      return NextResponse.json({ error: `Invalid currency code: ${String(rawCurrency)}`, message: 'Currency must be a 3-letter ISO code (e.g. GBP, USD)' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // For security, fetch product prices server-side using slug (or id) and build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    const metadataProducts: { id: string; slug: string; quantity: number; unit_amount: number }[] = []

    // Determine conversion rate from GBP to sessionCurrency using exchangerate host
    let rate = 1
    if (sessionCurrency !== 'GBP') {
      try {
        const fetched = await getRate(sessionCurrency, 'GBP')
        if (typeof fetched !== 'number' || Number.isNaN(fetched)) {
          console.warn('Unsupported currency requested for checkout (no rate):', sessionCurrency)
          // Try to return a helpful list of supported currencies to aid debugging
          try {
            const { fetchRates } = await import('@/lib/exchange')
            const rates = await fetchRates('GBP')
            const supported = Object.keys(rates.rates || {})
            console.warn('Unsupported currency for checkout, returning supported currencies', { sessionCurrency, supportedCount: supported.length })
            return NextResponse.json({ error: `Unsupported currency: ${sessionCurrency}`, message: 'No exchange rate available for requested currency', supported_currencies: supported, request: { provided: rawCurrency, normalized: sessionCurrency, itemsCount: Array.isArray(items) ? items.length : 0 } }, { status: 400 })
          } catch (innerErr) {
            console.warn('Unsupported currency and failed to fetch supported currencies', { sessionCurrency, err: innerErr })
            return NextResponse.json({ error: `Unsupported currency: ${sessionCurrency}`, message: 'No exchange rate available for requested currency', request: { provided: rawCurrency, normalized: sessionCurrency, itemsCount: Array.isArray(items) ? items.length : 0 } }, { status: 400 })
          }
        }
        rate = fetched
      } catch (e: any) {
        console.error('Failed to fetch exchange rate, aborting checkout', e)
        return NextResponse.json({ error: 'Failed to fetch exchange rate', details: String(e?.message ?? e) }, { status: 500 })
      }
    }

  const supabase = createServiceClient()

    for (const it of items) {
      if (!it.slug) return NextResponse.json({ error: 'Invalid item: missing slug' }, { status: 400 })
      const product = await getProductBySlug(it.slug)
      if (!product) return NextResponse.json({ error: `Product not found: ${it.slug}` }, { status: 404 })
      if (!product.is_available) return NextResponse.json({ error: `Product not available: ${product.name}` }, { status: 400 })

      const qty = it.quantity || 1
      // Validate quantity
      if (!Number.isInteger(qty) || qty <= 0) {
        return NextResponse.json({ error: `Invalid quantity for ${product.slug}: ${qty}` }, { status: 400 })
      }

      // If stock tracking in DB, enforce it
      if (typeof product.stock_quantity === 'number' && product.stock_quantity < qty) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 })
      }

      const price = product.price ?? 0
      if (price <= 0) {
        return NextResponse.json({ error: `Invalid price for product ${product.slug}` }, { status: 400 })
      }

      // Try to find an existing Stripe Price ID for this product+currency in our DB
  const currencyCode = sessionCurrency.toUpperCase()
      let { data: existingPriceRows } = await supabase.from('product_prices').select('stripe_price_id').eq('product_id', product.id).eq('currency', currencyCode).limit(1)
      let priceId: string | null = existingPriceRows && existingPriceRows[0] ? existingPriceRows[0].stripe_price_id : null

      // Prepare an absolute image URL (if available) so we can attach it to existing Stripe Products
      const rawImageForStripe = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined
      let imageUrlForStripe: string | undefined = undefined
      if (rawImageForStripe) {
        if (/^https?:\/\//i.test(rawImageForStripe)) {
          imageUrlForStripe = rawImageForStripe
        } else {
          const base = (process.env.NEXT_PUBLIC_APP_URL && String(process.env.NEXT_PUBLIC_APP_URL).trim()) || 'http://localhost:3000'
          imageUrlForStripe = `${base.replace(/\/$/, '')}/${String(rawImageForStripe).replace(/^\//, '')}`
        }
      }

      // If we found an existing Stripe Price ID, ensure the associated Stripe Product has images set.
      // This helps when the Price/Product was created previously without images in Stripe Dashboard.
      if (priceId && imageUrlForStripe) {
        try {
          const existingPrice = await stripe.prices.retrieve(priceId)
          // price.product may be a string id or an expanded Product object
          const stripeProductId = typeof existingPrice.product === 'string' ? existingPrice.product : (existingPrice.product && (existingPrice.product as any).id)
          if (stripeProductId) {
            try {
              const stripeProduct = await stripe.products.retrieve(String(stripeProductId))
              const hasImages = Array.isArray(stripeProduct.images) && stripeProduct.images.length > 0
              if (!hasImages) {
                // Update product images
                await stripe.products.update(String(stripeProductId), { images: [imageUrlForStripe] })
              }
            } catch (innerErr) {
              console.warn('Failed to retrieve/update Stripe product images', { productId: stripeProductId, err: innerErr })
            }
          }
        } catch (e) {
          // Non-fatal: continue and allow creation path to run if priceId ultimately isn't used
          console.warn('Failed to retrieve existing Stripe price for image sync', { priceId, err: e })
        }
      }

      if (!priceId) {
        // Create a new Stripe Price (and attendant Product) for this product/currency
        // Some currencies are zero-decimal (no minor unit). Use correct multiplier per currency to avoid Stripe errors.
        const ZERO_DECIMAL_CURRENCIES = new Set([
          'BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF','VND','VUV','XAF','XOF','XPF'
        ])
        const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currencyCode)
        const multiplier = isZeroDecimal ? 1 : 100
        const unitAmountInTarget = Math.round(price * rate * multiplier)
        try {
          // Include product image (first image) if available so Stripe Checkout displays it
          // Ensure image URL is absolute (Stripe requires an absolute URL). If the stored image
          // is a relative path, prefix with NEXT_PUBLIC_APP_URL or localhost fallback.
          const rawImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined
          let imageUrl: string | undefined = undefined
          if (rawImage) {
            if (/^https?:\/\//i.test(rawImage)) {
              imageUrl = rawImage
            } else {
              const base = (process.env.NEXT_PUBLIC_APP_URL && String(process.env.NEXT_PUBLIC_APP_URL).trim()) || 'http://localhost:3000'
              imageUrl = `${base.replace(/\/$/, '')}/${String(rawImage).replace(/^\//, '')}`
            }
          }
          const productImages = imageUrl ? [imageUrl] : undefined

          const created = await stripe.prices.create({
            unit_amount: unitAmountInTarget,
            currency: currencyCode.toLowerCase(),
            product_data: {
              name: product.name,
              ...(productImages ? { images: productImages } : {}),
            },
            // Set a nickname so it can be found in Stripe Dashboard if desired
            nickname: `${product.slug}_${currencyCode}`,
          })
          priceId = created.id

          // Persist mapping to product_prices table for reuse
          const { error: upsertErr } = await supabase.from('product_prices').upsert({ product_id: product.id, currency: currencyCode, stripe_price_id: priceId }, { onConflict: 'product_id,currency' })
          if (upsertErr) console.warn('Failed to upsert product_prices mapping', upsertErr)
        } catch (e: any) {
          console.error('Failed to create Stripe Price for product', product.id, e)
          // If Stripe returns a bad request due to currency issues, include the underlying message for easier debugging
          const message = e?.message ?? 'Failed to create Stripe Price'
          return NextResponse.json({ error: 'Failed to prepare product price', message }, { status: 500 })
        }
      }

      // Use Stripe Price ID for line item so Stripe manages amounts/currency
      line_items.push({ price: priceId as string, quantity: qty })

      metadataProducts.push({ id: product.id, slug: product.slug, quantity: qty, unit_amount: 0 })
    }

    const sessionReference = `session_${Date.now()}_${Math.random().toString(36).slice(2,8)}`

    let session: Stripe.Checkout.Session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=success`,
        cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=cancel`,
        // Keep metadata small to avoid Stripe per-key size limits — don't store the full products JSON here.
        // Webhook already falls back to listing Stripe line items when metadata.products is absent.
        metadata: {
          ...metadata,
          session_reference: sessionReference,
          products_count: String(metadataProducts.length || 0),
        },
      })
    } catch (stripeErr: any) {
      console.error('Stripe API error creating session:', stripeErr)
      const message = stripeErr?.message || 'Stripe API error'
      // Do not leak sensitive details, but include helpful message and raw error for debugging in logs
      return NextResponse.json({ error: message, details: stripeErr?.raw ?? null }, { status: 500 })
    }

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
