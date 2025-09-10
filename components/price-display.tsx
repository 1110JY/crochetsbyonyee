"use client"

import { useCurrency } from "@/contexts/currency-context"

interface PriceDisplayProps {
  price: number | null
  className?: string
  showCurrency?: boolean
}

export function PriceDisplay({ price, className = "", showCurrency = true }: PriceDisplayProps) {
  const { formatPrice, selectedCurrency, isLoading } = useCurrency()

  if (!price) {
    return (
      <div className={className}>
        Price on request
      </div>
    )
  }

  return (
    <div className={className}>
      {isLoading ? (
        <>
          <div>{formatPrice(price)}</div>
          <div className="text-xs text-muted-foreground">(updating...)</div>
        </>
      ) : (
        <>
          {formatPrice(price)}
          {showCurrency && selectedCurrency !== "GBP" && (
            <span className="text-xs text-muted-foreground ml-1">
              ({selectedCurrency})
            </span>
          )}
        </>
      )}
    </div>
  )
}
