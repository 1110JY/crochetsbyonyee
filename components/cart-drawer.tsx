"use client"
import React, { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-context"
import { StripeCheckoutButton } from "./stripe-checkout-button"

export function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem, total, clear } = useCart()

  const stripeItems = items.map((i) => ({ slug: i.slug, id: i.id, name: i.name, unit_amount: Math.round((i.price || 0) * 100), quantity: i.quantity, currency: i.currency || "usd", description: i.slug, image: i.image }))

  const [isDesktop, setIsDesktop] = useState(false)
  const asideRef = useRef<HTMLDivElement | null>(null)

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
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

          <aside id="cart-sidebar" ref={asideRef} role="dialog" aria-modal="true" aria-label="Cart sidebar" aria-hidden={!open} className={`fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-lg p-6 overflow-auto z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
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
                        <div className="text-sm text-muted-foreground">{it.quantity} × ${(it.price || 0).toFixed(2)}</div>
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
                  <div className="font-mochiy">${(total || 0).toFixed(2)}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <StripeCheckoutButton items={stripeItems} />
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 rounded-md" onClick={() => clear()}>Clear</Button>
                </div>
              </div>
            )}
          </aside>
        </>
      ) : (
        // Mobile: use Dialog overlay as before
        <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent id="cart-sidebar" className="fixed right-0 inset-y-0 h-full w-full sm:w-[420px] bg-white shadow-lg p-6 overflow-auto z-50" showCloseButton={false}>
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
                        <div className="text-sm text-muted-foreground">{it.quantity} × ${(it.price || 0).toFixed(2)}</div>
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
                  <div className="font-mochiy">${(total || 0).toFixed(2)}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <StripeCheckoutButton items={stripeItems} />
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
