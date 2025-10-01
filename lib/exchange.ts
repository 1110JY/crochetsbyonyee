// Lightweight exchange-rate fetcher with in-memory caching.
// Uses exchangerate.host (free, no API key) as a reliable source.
export const DEFAULT_BASE = 'GBP'

type RatesResponse = {
  base: string
  date: string
  rates: Record<string, number>
}

const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour

let cached: { fetchedAt: number; data: RatesResponse } | null = null

export async function fetchRates(base = DEFAULT_BASE): Promise<RatesResponse> {
  const now = Date.now()
  if (cached && cached.fetchedAt + CACHE_TTL_MS > now && cached.data.base === base) {
    return cached.data
  }

  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates (${res.status})`)
  }
  const json = await res.json()
  // exchangerate.host can return { success: false, error: { ... } } in some environments (missing key, rate limits)
  if (json && json.success === false) {
    const errMsg = json.error?.type || JSON.stringify(json.error || json)
    // Log but do not throw — return an empty rates object so callers can apply fallback logic
    console.warn('Exchange API returned success:false', errMsg)
    const data: RatesResponse = { base, date: new Date().toISOString(), rates: {} }
    cached = { fetchedAt: now, data }
    return data
  }
  const data: RatesResponse = { base: json.base || base, date: json.date || new Date().toISOString(), rates: json.rates || {} }
  cached = { fetchedAt: now, data }
  return data
}

export async function getRate(target: string, base = DEFAULT_BASE): Promise<number> {
  const rates = await fetchRates(base)
  const key = (target || '').toUpperCase()
  // If rates are empty (e.g., API returned success:false), provide a conservative fallback for common currencies
  if (!rates || !rates.rates || Object.keys(rates.rates).length === 0) {
    console.warn('Exchange rates source returned empty. Using fallback rates for common currencies.')
    const FALLBACK: Record<string, number> = { USD: 1.28, EUR: 1.17, GBP: 1 }
    return FALLBACK[key]
  }
  return rates.rates[key]
}
