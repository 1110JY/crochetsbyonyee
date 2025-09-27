import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import createServiceClient from '@/lib/supabase/service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-08-27.basil' })

export async function POST(req: Request) {
  const buf = await req.arrayBuffer()
  const payload = Buffer.from(buf)
  const sig = req.headers.get('stripe-signature') || ''

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '')

    // Handle event types you care about
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        try {
          const supabase = createServiceClient()

          // Check idempotency: if order with this session already exists, skip
          if (!session.id) {
            console.error('Session has no id; cannot process')
            break
          }

          const { data: existingOrder } = await supabase.from('orders').select('id').eq('stripe_session_id', session.id).maybeSingle()
          if (existingOrder) {
            console.log('Order for session already exists, skipping:', session.id)
            break
          }

          // Prefer the metadata.products snapshot (set at session creation)
          let products: { id: string; slug: string; quantity: number; unit_amount: number }[] = []
          if (session.metadata && session.metadata.products) {
            try {
              products = JSON.parse(session.metadata.products as string)
            } catch (e) {
              console.warn('Failed to parse session.metadata.products', e)
            }
          }

          // If metadata missing, fall back to listing Stripe line items
          if (products.length === 0 && session.id) {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id as string, { limit: 100 })
            products = (lineItems.data || []).map((li: any) => ({
              id: li.price?.product as string || li.price?.id,
              slug: (li.description as string) || (li.price?.product as string) || '',
              quantity: li.quantity ?? 1,
              unit_amount: li.amount_subtotal ?? li.price?.unit_amount ?? null,
            }))
          }

          // Build order record
          const orderRecord: any = {
            stripe_session_id: session.id,
            session_reference: session.metadata?.session_reference ?? null,
            amount_total: session.amount_total ?? null,
            currency: session.currency ?? null,
            customer_email: (session.customer_details && session.customer_details.email) || session.customer_email || null,
            metadata: session.metadata || {},
            payment_status: session.payment_status || null,
          }

          // Insert order and items inside a transaction-like flow (Supabase doesn't support multi-statement transactions via client easily)
          const { data: orderData, error: orderError } = await supabase.from('orders').insert([orderRecord]).select('*').single()

          if (orderError) {
            console.error('Failed to create order record in Supabase:', orderError)
          } else if (orderData) {
            const orderId = orderData.id

            // Prepare order items using metadata products
            const itemsToInsert = products.map((p) => ({
              order_id: orderId,
              product_id: p.id,
              product_slug: p.slug,
              product_name: null,
              description: null,
              unit_amount: p.unit_amount ?? null,
              quantity: p.quantity ?? 1,
              currency: session.currency ?? null,
            }))

            if (itemsToInsert.length > 0) {
              const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert)
              if (itemsError) {
                console.error('Failed to insert order items:', itemsError)
              }
            }

            // Optionally decrement stock quantities for products that track stock
            for (const p of products) {
              try {
                // Reduce stock only when stock_quantity column exists
                const { data: prodRow, error: prodErr } = await supabase.from('products').select('id, stock_quantity').eq('id', p.id).maybeSingle()
                if (prodErr) {
                  console.warn('Error fetching product for stock update', p.id, prodErr)
                  continue
                }
                if (prodRow && typeof prodRow.stock_quantity === 'number') {
                  const newQty = Math.max(0, (prodRow.stock_quantity || 0) - (p.quantity || 0))
                  const { error: updErr } = await supabase.from('products').update({ stock_quantity: newQty }).eq('id', p.id)
                  if (updErr) console.warn('Failed to decrement stock for', p.id, updErr)
                }
              } catch (e) {
                console.warn('Stock decrement error for', p.id, e)
              }
            }

            console.log('Order and items recorded in Supabase', orderId)
          }
        } catch (dbErr) {
          console.error('Error processing checkout.session.completed:', dbErr)
        }

        break
      }
      case 'payment_intent.succeeded':
        // handle
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }
}
