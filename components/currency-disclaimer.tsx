"use client"

import { useCurrency } from "@/contexts/currency-context"
import { Info } from "lucide-react"

export function CurrencyDisclaimer() {
  const { selectedCurrency } = useCurrency()

  if (selectedCurrency === "GBP") return null

  return (
    <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
      <Info className="w-3 h-3" />
      <span>
        Prices shown in {selectedCurrency} are estimates based on current exchange rates. 
        Final pricing will be confirmed in GBP.
      </span>
    </div>
  )
}
