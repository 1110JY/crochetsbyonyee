"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string | null
  slug?: string
  currency?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clear: () => void
  total: number
  open: boolean
  setOpen: (v: boolean) => void
}

const CART_KEY = "cboy_cart_v1"

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }, [items])

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id)
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p))
      }
      return [...prev, { ...item, quantity: qty }]
    })
    setOpen(true)
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id)
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)))
  }

  const clear = () => {
    setItems([])
    setOpen(false)
  }

  const total = useMemo(() => items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export default CartContext
