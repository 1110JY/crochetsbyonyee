"use client"
import { useEffect, useState } from "react"
import { useCart } from "@/components/cart-context"
import { useSearchParams } from "next/navigation"
import { toast } from "@/lib/toast"

export function CheckoutSuccessHandler() {
  const { clear } = useCart()
  const searchParams = useSearchParams()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (searchParams.get("checkout") === "success" && !shown) {
      clear()
      toast.success("Thank you for your purchase! Your order has been received.")
      setShown(true)
    }
    // Only run on mount or when searchParams changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return null
}
