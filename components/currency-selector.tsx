"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, Globe } from "lucide-react"
import { useCurrency, CURRENCIES } from "@/contexts/currency-context"

interface CurrencySelectorProps {
  variant?: "default" | "mobile"
}

export function CurrencySelector({ variant = "default" }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency, isLoading } = useCurrency()

  if (variant === "mobile") {
    return (
      <div className="bg-primary/10 rounded-lg p-3" style={{ border: 'none', outline: 'none' }}>
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Currency</span>
        </div>
        
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={isLoading}>
          <SelectTrigger className="w-full" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{selectedCurrency}</span>
              <span className="text-sm text-muted-foreground">
                {CURRENCIES.find(c => c.code === selectedCurrency)?.name}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white max-h-64 overflow-y-auto" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
            {CURRENCIES.map((currency) => (
              <SelectItem 
                key={currency.code} 
                value={currency.code}
                className="hover:bg-gray-50 focus:bg-gray-50"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{currency.code}</span>
                    <span className="text-sm text-gray-600">{currency.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{currency.symbol}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <div className="text-xs text-muted-foreground mt-1">Updating exchange rates...</div>
        )}
      </div>
    )
  }

  return (
    <Select value={selectedCurrency} onValueChange={setSelectedCurrency} disabled={isLoading}>
      <SelectTrigger className="w-24 h-8 bg-primary/5 hover:bg-primary/10 border-primary/20 text-foreground text-xs">
        <div className="flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span className="font-medium">{selectedCurrency}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
        <div className="p-2 border-b border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-600 mb-1">Select Currency</div>
          <div className="text-xs text-gray-500">All prices will update</div>
        </div>
        {CURRENCIES.map((currency) => (
          <SelectItem 
            key={currency.code} 
            value={currency.code}
            className="hover:bg-gray-50 focus:bg-gray-50"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{currency.code}</span>
                <span className="text-sm text-gray-600">{currency.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{currency.symbol}</span>
            </div>
          </SelectItem>
        ))}
        {isLoading && (
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-600">Updating exchange rates...</div>
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
