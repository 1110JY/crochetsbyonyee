"use client"
import React, { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-context"
import { useCurrency } from '@/contexts/currency-context'

export function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem, total, clear } = useCart()

  const stripeItems = items.map((i) => ({ slug: i.slug, id: i.id, name: i.name, unit_amount: Math.round((i.price || 0) * 100), quantity: i.quantity, currency: i.currency || "gbp", description: i.slug, image: i.image }))

  const [isDesktop, setIsDesktop] = useState(false)
  const [overLimitItems, setOverLimitItems] = useState<{ id: string; slug?: string; name: string; requested: number; available: number | null }[]>([])
  const asideRef = useRef<HTMLDivElement | null>(null)
  const { formatPrice, getCurrencySymbol, selectedCurrency } = useCurrency()

  const preCheckStock = async () => {
    if (!items || items.length === 0) return true
    // Fetch product info in parallel
    const checks = await Promise.all(items.map(async (it) => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(it.slug || '')}`)
        if (!res.ok) return { id: it.id, slug: it.slug, name: it.name, requested: it.quantity, available: null, error: true }
        const data = await res.json()
        return { id: it.id, slug: it.slug, name: it.name, requested: it.quantity, available: typeof data.stock_quantity === 'number' ? data.stock_quantity : null }
      } catch (e) {
        return { id: it.id, slug: it.slug, name: it.name, requested: it.quantity, available: null }
      }
    }))

    const over = checks.filter((c) => typeof c.available === 'number' && c.requested > (c.available ?? 0))
    setOverLimitItems(over.map((o) => ({ id: o.id, slug: o.slug, name: o.name, requested: o.requested, available: o.available })))
    return over.length === 0
  }

  const [conversionRate, setConversionRate] = useState<number | null>(null)

  useEffect(() => {
    // Fetch conversion rate for selected currency to show note in cart
    const fetchRate = async () => {
      if (!selectedCurrency || selectedCurrency === 'GBP') {
        setConversionRate(null)
        return
      }
      try {
        const res = await fetch(`/api/exchange/${encodeURIComponent(selectedCurrency)}`)
        if (!res.ok) return setConversionRate(null)
        const data = await res.json()
        setConversionRate(data.rate ?? null)
      } catch (e) {
        setConversionRate(null)
      }
    }
    fetchRate()
  }, [selectedCurrency])

  useEffect(() => {
    const m = window.matchMedia('(min-width: 640px)')
    const onChange = () => setIsDesktop(m.matches)
    onChange()
    m.addEventListener?.('change', onChange)
    return () => m.removeEventListener?.('change', onChange)
  }, [])

  // Focus management for desktop aside: trap focus while open and restore on close
  useEffect(() => {
    if (!isDesktop) return
    let prevFocused: Element | null = null

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
      if (e.key === 'Tab' && asideRef.current) {
        const focusable = asideRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    function handleFocusIn(e: FocusEvent) {
      if (!open) return
      if (!asideRef.current) return
      if (asideRef.current.contains(e.target as Node)) return
      // move focus into aside
      const focusable = asideRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable && focusable.length > 0) focusable[0].focus()
    }

    if (open) {
      prevFocused = document.activeElement
      // focus first focusable element inside aside
      setTimeout(() => {
        if (!asideRef.current) return
        const focusable = asideRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable && focusable.length > 0) focusable[0].focus()
      }, 0)

      document.addEventListener('keydown', handleKey)
      document.addEventListener('focusin', handleFocusIn)
    }

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('focusin', handleFocusIn)
      if (prevFocused instanceof HTMLElement) prevFocused.focus()
    }
  }, [open, isDesktop, setOpen])

  return (
    <>
      {isDesktop ? (
        // Desktop: always mount the aside and animate with translateX so content rides the panel
        <>
          {/* Backdrop (raised above site annoucement bar) */}
          <div onClick={() => setOpen(false)} className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

          <aside id="cart-sidebar" ref={asideRef} role="dialog" aria-modal="true" aria-label="Cart sidebar" aria-hidden={!open} className={`fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-lg p-6 overflow-auto z-60 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ paddingBottom: '5.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your cart</h3>
              <Button variant="ghost" className="underline-hover" onClick={() => setOpen(false)}>Close</Button>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">Your cart is empty</div>
            ) : (
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.image || '/placeholder.jpg'} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-muted-foreground">{it.quantity} × {formatPrice(it.price || 0)}</div>
                        {overLimitItems.find((o) => o.id === it.id) && (
                          <div className="text-sm text-red-600 mt-1">Insufficient stock: requested {it.quantity}, available {overLimitItems.find((o) => o.id === it.id)?.available ?? '0'}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input className="w-16 border rounded px-2 py-1" type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(it.id, Number(e.target.value))} />
                      <Button variant="ghost" className="underline-hover" onClick={() => removeItem(it.id)}>Remove</Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="font-semibold">Total</div>
                  <div className="font-mochiy">{formatPrice(total || 0)}</div>
                </div>

                {conversionRate && (
                  <div className="text-xs text-muted-foreground mt-1">Conversion rate used for checkout: 1 GBP = {conversionRate} {selectedCurrency}</div>
                )}

                <div className="flex gap-2 mt-4">
                  {/* Single Checkout button: run pre-check then create session */}
                  <Button onClick={async () => {
                    const ok = await preCheckStock()
                    if (!ok) return
                    try {
                        const currencyOut = (selectedCurrency || 'GBP').toString().trim().toUpperCase()
                        const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: stripeItems, currency: currencyOut }),
                      })
                      const text = await res.text()
                      let data: any = {}
                      try { data = text ? JSON.parse(text) : {} } catch (e) { data = { __raw: text } }
                      if (!res.ok) {
                        console.error('Checkout creation failed', res.status, data)
                        const { toast } = await import('@/lib/toast')
                        toast.error('Checkout failed', String(data?.error ?? data?.message ?? data?.__raw ?? res.status))
                        return
                      }
                      if (data?.url) {
                        window.location.href = data.url
                      } else {
                        const { toast } = await import('@/lib/toast')
                        toast.error('Checkout failed', 'Unable to create a checkout session.')
                      }
                    } catch (e) {
                      console.error('Checkout error', e)
                      const { toast } = await import('@/lib/toast')
                      toast.error('Checkout error', String((e as any)?.message ?? 'An error occurred'))
                    }
                  }} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded">Checkout</Button>

                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 rounded-md" onClick={() => clear()}>Clear</Button>
                </div>
                {/* Sticky footer on small screens to keep actions visible */}
                <div className="sm:hidden fixed left-0 right-0 bottom-0 bg-white border-t p-3 z-70">
                  <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="font-semibold">Total</div>
                    <div className="font-mochiy">{formatPrice(total || 0)}</div>
                  </div>
                  <div className="mt-3">
                    <Button onClick={async () => {
                      const ok = await preCheckStock()
                      if (!ok) return
                      try {
                        const currencyOut = (selectedCurrency || 'GBP').toString().trim().toUpperCase()
                        const res = await fetch('/api/stripe/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ items: stripeItems, currency: currencyOut }),
                        })
                        const text = await res.text()
                        let data: any = {}
                        try { data = text ? JSON.parse(text) : {} } catch (e) { data = { __raw: text } }
                        if (!res.ok) {
                          console.error('Checkout creation failed', res.status, data)
                          const { toast } = await import('@/lib/toast')
                          toast.error('Checkout failed', String(data?.error ?? data?.message ?? data?.__raw ?? res.status))
                          return
                        }
                        if (data?.url) {
                          window.location.href = data.url
                        } else {
                          const { toast } = await import('@/lib/toast')
                          toast.error('Checkout failed', 'Unable to create a checkout session.')
                        }
                      } catch (e) {
                        console.error('Checkout error', e)
                        const { toast } = await import('@/lib/toast')
                        toast.error('Checkout error', String((e as any)?.message ?? 'An error occurred'))
                      }
                    }} className="w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded">Checkout</Button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </>
      ) : (
        // Mobile: use Dialog overlay as before
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent id="cart-sidebar" className="fixed right-0 inset-y-0 h-full w-full sm:w-[420px] bg-white shadow-lg p-6 overflow-auto z-60 pb-24" showCloseButton={false}>
            <DialogTitle>
              <span className="sr-only">Cart dialog</span>
            </DialogTitle>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your cart</h3>
              <Button variant="ghost" className="underline-hover" onClick={() => setOpen(false)}>Close</Button>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">Your cart is empty</div>
            ) : (
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.image || '/placeholder.jpg'} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-muted-foreground">{it.quantity} × {formatPrice(it.price || 0)}</div>
                        {overLimitItems.find((o) => o.id === it.id) && (
                          <div className="text-sm text-red-600 mt-1">Insufficient stock: requested {it.quantity}, available {overLimitItems.find((o) => o.id === it.id)?.available ?? '0'}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input className="w-16 border rounded px-2 py-1" type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(it.id, Number(e.target.value))} />
                      <Button variant="ghost" className="underline-hover" onClick={() => removeItem(it.id)}>Remove</Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 flex items-center justify-between">
                  <div className="font-semibold">Total</div>
                  <div className="font-mochiy">{formatPrice(total || 0)}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={async () => {
                    const ok = await preCheckStock()
                    if (!ok) return
                    try {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: stripeItems, currency: selectedCurrency }),
                      })
                      const text = await res.text()
                      let data: any = {}
                      try { data = text ? JSON.parse(text) : {} } catch (e) { data = { __raw: text } }
                      if (!res.ok) {
                        console.error('Checkout creation failed', res.status, data)
                        const { toast } = await import('@/lib/toast')
                        toast.error('Checkout failed', String(data?.error ?? data?.message ?? data?.__raw ?? res.status))
                        return
                      }
                      if (data?.url) {
                        window.location.href = data.url
                      } else {
                        const { toast } = await import('@/lib/toast')
                        toast.error('Checkout failed', 'Unable to create a checkout session.')
                      }
                    } catch (e) {
                      console.error('Checkout error', e)
                      const { toast } = await import('@/lib/toast')
                      toast.error('Checkout error', String((e as any)?.message ?? 'An error occurred'))
                    }
                  }} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded">Checkout</Button>

                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 rounded-md" onClick={() => clear()}>Clear</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default CartDrawer
