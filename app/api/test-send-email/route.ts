import { Resend } from 'resend'
import React from 'react'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Safety: only allow in non-production to avoid accidental sends
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const to: string = body.to
    const orderId: string = body.orderId || `test_${Date.now()}`
    const items = Array.isArray(body.items) ? body.items : [{ name: 'Test item', slug: 'test-item', quantity: 1, unit_amount: 500 }]
    const total = body.total ?? items.reduce((s: number, it: any) => s + ((it.unit_amount ?? 0) * (it.quantity ?? 1)), 0)
    const customerName = body.customerName ?? null

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Dynamically import server-only modules to avoid leaking server APIs into client bundles
    const [{ renderToStaticMarkup }, OrderConfirmationModule] = await Promise.all([
      import('react-dom/server'),
      import('@/components/emails/order-confirmation'),
    ])
    const EmailComponent = (OrderConfirmationModule as any).default
    const element = React.createElement(EmailComponent as any, { orderId, items, total, customerName })
    const html = renderToStaticMarkup(element)

    const fromAddress = process.env.SEND_FROM_EMAIL || 'onboarding@resend.dev'

    console.log('Test-send: sending email', { to, from: fromAddress, orderId, htmlType: typeof html, htmlLength: html?.length })

  const result = await resend.emails.send({ from: fromAddress, to: [to], subject: `Test order confirmation — ${orderId}`, html })

  // Make a JSON-safe copy of the result for logging and response (helps PowerShell display it)
  const rawResult = JSON.parse(JSON.stringify(result))
  const messageId = (rawResult && (rawResult as any).id) ? (rawResult as any).id : null
  console.log('Test-send result:', rawResult)
  return NextResponse.json({ success: true, messageId, result: rawResult })
  } catch (err: any) {
    console.error('Test-send failed:', err)
    return NextResponse.json({ success: false, error: String(err?.message ?? err) }, { status: 500 })
  }
}
