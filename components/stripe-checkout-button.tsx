"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'
import { useCurrency } from '@/contexts/currency-context'

interface Item {
  slug?: string
  id?: string
  name?: string
  unit_amount?: number
  quantity?: number
}

export function StripeCheckoutButton({ items, successUrl, cancelUrl }: { items: Item[]; successUrl?: string; cancelUrl?: string }) {
  const [loading, setLoading] = useState(false)
  const { selectedCurrency } = useCurrency()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Normalize to slug+quantity pairs for server-side validation
  const payload = items.map((i) => ({ slug: i.slug || i.id || i.name, quantity: i.quantity || 1 }))

      const currencyOut = (selectedCurrency || 'GBP').toString().trim().toUpperCase()
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload, success_url: successUrl, cancel_url: cancelUrl, currency: currencyOut }),
      })

      const text = await res.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        data = { __raw: text }
      }

      if (!res.ok) {
        console.error('Checkout creation failed', res.status, data)
        // Show a toast message for stock errors or other failures
        const msg = data?.error ?? data?.message ?? data?.__raw ?? `Error ${res.status}`
        toast.error('Checkout failed', String(msg))
        setLoading(false)
        return
      }

      if (data?.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout creation failed (no url in response)', data)
        toast.error('Checkout failed', 'Unable to create a checkout session.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error', err)
      toast.error('Checkout error', String((err as any)?.message ?? 'An error occurred during checkout'))
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white">
      {loading ? 'Redirecting...' : 'Checkout'}
    </Button>
  )
}
