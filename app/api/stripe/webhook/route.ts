import Stripe from 'stripe'
import { Resend } from 'resend'
import React from 'react'
import { NextResponse } from 'next/server'
import createServiceClient from '@/lib/supabase/service'

// Do not instantiate Stripe at module load so we can surface clearer runtime errors


export async function POST(req: Request) {
  const buf = await req.arrayBuffer()
  const payload = Buffer.from(buf)
  const sig = req.headers.get('stripe-signature') || ''

  // Debug: log presence of important env vars (do NOT log values)
  try {
    console.log('ENV presence:', {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      SEND_FROM_EMAIL: !!process.env.SEND_FROM_EMAIL,
    })
  } catch (e) {
    // ignore logging errors
  }

  // Runtime checks
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not set')
    return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 })
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Stripe webhook secret not configured' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-08-27.basil' })

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)

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

          // Prefer the metadata.products snapshot (set at session creation) when available.
          // However, we intentionally don't store the full products JSON in metadata to avoid size limits.
          let products: { id: string; slug: string; quantity: number; unit_amount: number }[] = []
          if (session.metadata && session.metadata.products) {
            try {
              products = JSON.parse(session.metadata.products as string)
            } catch (e) {
              console.warn('Failed to parse session.metadata.products', e)
            }
          } else if (session.metadata && session.metadata.products_count) {
            // Helpful for debugging: note expected products count from metadata
            console.log('Webhook metadata products_count:', session.metadata.products_count)
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
            amount_total: session.amount_total ?? null,
            currency: session.currency ?? null,
            customer_email: (session.customer_details && session.customer_details.email) || session.customer_email || null,
            metadata: session.metadata || {},
            payment_status: session.payment_status || null,
          }

          // Only include session_reference if it exists in metadata (avoids schema cache errors if the column doesn't exist)
          if (session.metadata && session.metadata.session_reference) {
            orderRecord.session_reference = session.metadata.session_reference
          }

          // Insert order and items inside a transaction-like flow (Supabase doesn't support multi-statement transactions via client easily)
          let { data: orderData, error: orderError } = await supabase.from('orders').insert([orderRecord]).select('*').single()

          // Defensive fallback: if Supabase reports missing column(s) in the schema cache (PGRST204),
          // remove the offending keys from the payload and retry once so orders still get created.
          if (orderError && (orderError.code === 'PGRST204' || (orderError.message && orderError.message.includes('Could not find')))) {
            try {
              console.warn('Supabase schema error on order insert, attempting fallback by removing unknown columns:', orderError.message)
              // Try to parse the column name from the message
              const msg: string = orderError.message || ''
              const m = msg.match(/Could not find the '([a-zA-Z0-9_]+)' column of '([a-zA-Z0-9_]+)'/)
              if (m && m[1]) {
                const missingCol = m[1]
                if (missingCol in orderRecord) {
                  delete orderRecord[missingCol]
                }
              }
              // retry once
              const retry = await supabase.from('orders').insert([orderRecord]).select('*').single()
              orderData = retry.data
              orderError = retry.error
              if (orderError) console.error('Retry insert still failed:', orderError)
              else console.log('Order insert succeeded on retry after removing unknown columns')
            } catch (retryErr) {
              console.error('Retry insert failed with exception', retryErr)
            }
          }

          if (orderError) {
            console.error('Failed to create order record in Supabase:', orderError)
          } else if (orderData) {
            const orderId = orderData.id

            // Prepare order items using metadata products
            const itemsToInsert: any[] = []
            // Try to map Stripe product ids (prod_...) or slugs to internal product UUIDs
            for (const p of products) {
              let resolvedProductId: string | null = null
              // If the id looks like a UUID, assume it's internal
              const uuidLike = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(p.id)
              if (uuidLike) {
                resolvedProductId = p.id
              } else if (p.slug) {
                try {
                  const { data: prodRow } = await supabase.from('products').select('id').eq('slug', p.slug).maybeSingle()
                  if (prodRow && prodRow.id) resolvedProductId = prodRow.id
                } catch (e) {
                  // ignore lookup errors and fall back
                }
              }

              itemsToInsert.push({
                order_id: orderId,
                product_id: resolvedProductId ?? p.id,
                product_slug: p.slug,
                product_name: p.slug || null,
                description: null,
                unit_amount: p.unit_amount ?? null,
                quantity: p.quantity ?? 1,
                currency: session.currency ?? null,
              })
            }

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

            // Send confirmation email to customer if we have an email and Resend is configured
            try {
              const customerEmail = orderRecord.customer_email || (session.customer_details && session.customer_details.email) || null
              if (customerEmail) {
                if (!process.env.RESEND_API_KEY) {
                  console.warn('RESEND_API_KEY not set; skipping confirmation email')
                } else {
                  const resend = new Resend(process.env.RESEND_API_KEY)

                  // Build simple items list for the email
                  const itemsForEmail = products.map((p) => ({
                    name: p.slug || p.id || undefined,
                    slug: p.slug || undefined,
                    quantity: p.quantity || 1,
                    unit_amount: p.unit_amount ?? null,
                  }))

                  const total = orderRecord.amount_total ?? null

                  // Render React Email template to HTML
                  // Dynamically import server-only modules and the email component to avoid build errors
                  const [{ renderToStaticMarkup }, OrderConfirmationModule] = await Promise.all([
                    import('react-dom/server'),
                    import('@/components/emails/order-confirmation'),
                  ])
                  const EmailComponent = (OrderConfirmationModule as any).default
                  const element = React.createElement(EmailComponent as any, { orderId, items: itemsForEmail, total, customerName: session.customer_details?.name || null })
                  const html = renderToStaticMarkup(element)

                  const fromAddress = process.env.SEND_FROM_EMAIL || 'onboarding@resend.dev'
                  console.log('Preparing to send order confirmation email', { to: customerEmail, from: fromAddress, orderId, htmlType: typeof html, htmlLength: html?.length ?? 0 })
                  try {
                    const emailResult = await resend.emails.send({
                      from: fromAddress,
                      to: [customerEmail],
                      subject: `Order confirmation — ${orderId}`,
                      html,
                    })
                    console.log('Order confirmation email sent, Resend response:', { result: emailResult })

                    // Persist resend message id into the orders table if the column exists
                    try {
                      const raw = JSON.parse(JSON.stringify(emailResult))
                      const messageId = raw?.data?.id || raw?.id || null
                      if (messageId) {
                        const { error: updErr } = await supabase.from('orders').update({ resend_message_id: messageId }).eq('id', orderId)
                        if (updErr) console.warn('Failed to persist resend_message_id on order', orderId, updErr)
                        else console.log('Persisted resend_message_id on order', orderId, messageId)
                      }
                    } catch (persistErr) {
                      console.warn('Failed to persist resend message id', persistErr)
                    }
                  } catch (sendErr) {
                    console.error('Resend send() failed for order email', { err: sendErr, to: customerEmail, orderId })
                  }
                }
              }
            } catch (emailErr) {
              console.error('Failed to send confirmation email', emailErr)
            }
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
