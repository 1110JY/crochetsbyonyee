"use client"
import React from 'react'
import { useCart } from './cart-context'

export function CartAwareWrapper({ children }: { children: React.ReactNode }) {
  const { open } = useCart()

  // When cart is open, add right padding on sm+ screens to make room for the cart drawer
  React.useEffect(() => {
    try {
      const val = open ? '480px' : '0px'
      document.documentElement.style.setProperty('--cart-offset', val)
      if (open) {
        document.documentElement.classList.add('cart-open')
        ;(window as any).__cartOpen = true
      } else {
        document.documentElement.classList.remove('cart-open')
        ;(window as any).__cartOpen = false
      }
    } catch (e) {
      // ignore
    }
  }, [open])

  return (
    <div className="cart-offset-padding">
      {children}
    </div>
  )
}

export default CartAwareWrapper
