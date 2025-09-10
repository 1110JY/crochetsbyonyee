"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Popular currencies for international customers (GBP first as base currency)
export const CURRENCIES = [
  // Base currency - UK business
  { code: "GBP", symbol: "£", name: "British Pound" },
  
  // Top tier - Most common international currencies
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  
  // Second tier - Major developed economies
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  
  // Third tier - Nordic and other developed countries
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  
  // Fourth tier - Other important economies
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  
  // Fifth tier - Emerging markets and others
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
]

interface ExchangeRates {
  [key: string]: number
}

interface CurrencyContextType {
  selectedCurrency: string
  exchangeRates: ExchangeRates
  isLoading: boolean
  setSelectedCurrency: (currency: string) => void
  convertPrice: (priceInGBP: number) => number
  formatPrice: (priceInGBP: number) => string
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState("GBP")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load saved currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency")
    if (savedCurrency && CURRENCIES.find(c => c.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

  // Save currency to localStorage when changed
  useEffect(() => {
    localStorage.setItem("selectedCurrency", selectedCurrency)
  }, [selectedCurrency])

  // Fetch exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (selectedCurrency === "GBP") {
        setExchangeRates({})
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/GBP")
        const data = await response.json()
        setExchangeRates(data.rates)
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error)
        // Fallback rates if API fails (rates from GBP to other currencies)
        setExchangeRates({
          // Top tier currencies
          USD: 1.37,
          EUR: 1.16,
          JPY: 151,
          
          // Second tier currencies
          CAD: 1.71,
          AUD: 1.85,
          CHF: 1.26,
          CNY: 8.84,
          
          // Third tier currencies
          SEK: 11.6,
          NOK: 12.1,
          DKK: 8.6,
          NZD: 1.99,
          
          // Fourth tier currencies
          SGD: 1.85,
          HKD: 10.7,
          KRW: 1616,
          MXN: 28.1,
          
          // Fifth tier currencies
          INR: 102,
          BRL: 7.1,
          RUB: 101,
          ZAR: 20.3,
          TRY: 11.5,
          PLN: 5.3,
          CZK: 29.4,
          HUF: 404,
          ILS: 4.4,
          AED: 5.03,
          SAR: 5.14,
          THB: 43.2,
          MYR: 5.7,
          PHP: 68.8,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRates()
    // Refresh rates every hour
    const interval = setInterval(fetchExchangeRates, 3600000)
    return () => clearInterval(interval)
  }, [selectedCurrency])

  const convertPrice = (priceInGBP: number) => {
    if (selectedCurrency === "GBP") return priceInGBP
    const rate = exchangeRates[selectedCurrency]
    if (!rate) return priceInGBP
    return priceInGBP * rate
  }

  const formatPrice = (priceInGBP: number) => {
    const convertedPrice = convertPrice(priceInGBP)
    const currency = CURRENCIES.find(c => c.code === selectedCurrency)
    if (!currency) return `£${priceInGBP.toFixed(2)}`
    
    // Currencies that don't use decimal places
    const noDecimalCurrencies = ["JPY", "KRW", "HUF", "CLP", "VND", "IDR"]
    const decimals = noDecimalCurrencies.includes(selectedCurrency) ? 0 : 2
    
    return `${currency.symbol}${convertedPrice.toFixed(decimals)}`
  }

  const getCurrencySymbol = () => {
    const currency = CURRENCIES.find(c => c.code === selectedCurrency)
    return currency?.symbol || "£"
  }

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      exchangeRates,
      isLoading,
      setSelectedCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
