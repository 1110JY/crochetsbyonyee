import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/supabase/products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-08-27.basil' })

type CartItem = { id?: string; slug?: string; quantity: number }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, success_url, cancel_url, metadata } = body as { items: CartItem[]; success_url?: string; cancel_url?: string; metadata?: Record<string, string> }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // For security, fetch product prices server-side using slug (or id) and build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    const metadataProducts: { id: string; slug: string; quantity: number; unit_amount: number }[] = []

    for (const it of items) {
      if (!it.slug) return NextResponse.json({ error: 'Invalid item: missing slug' }, { status: 400 })
      const product = await getProductBySlug(it.slug)
      if (!product) return NextResponse.json({ error: `Product not found: ${it.slug}` }, { status: 404 })
      if (!product.is_available) return NextResponse.json({ error: `Product not available: ${product.name}` }, { status: 400 })

      const qty = it.quantity || 1
      // If stock tracking in DB, enforce it
      if (typeof product.stock_quantity === 'number' && product.stock_quantity < qty) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 })
      }

      const price = product.price ?? 0

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description ?? undefined,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: qty,
      })

      metadataProducts.push({ id: product.id, slug: product.slug, quantity: qty, unit_amount: Math.round(price * 100) })
    }

    const sessionReference = `session_${Date.now()}_${Math.random().toString(36).slice(2,8)}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=success`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?checkout=cancel`,
      metadata: {
        ...metadata,
        session_reference: sessionReference,
        products: JSON.stringify(metadataProducts),
      },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
