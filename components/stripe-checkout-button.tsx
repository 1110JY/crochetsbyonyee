"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Item {
  slug?: string
  id?: string
  name?: string
  unit_amount?: number
  quantity?: number
}

export function StripeCheckoutButton({ items, successUrl, cancelUrl }: { items: Item[]; successUrl?: string; cancelUrl?: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Normalize to slug+quantity pairs for server-side validation
      const payload = items.map((i) => ({ slug: i.slug || i.id || i.name, quantity: i.quantity || 1 }))

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload, success_url: successUrl, cancel_url: cancelUrl }),
      })

      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout creation failed', data)
        alert('Failed to create checkout session')
        setLoading(false)
      }
    } catch (err) {
      console.error('Checkout error', err)
      alert('An error occurred during checkout')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white">
      {loading ? 'Redirecting...' : 'Checkout'}
    </Button>
  )
}
