"use client"

import { Truck, Globe, Package } from "lucide-react"

export function ShippingBanner() {
  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center space-x-6 text-sm font-medium text-primary">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Worldwide Shipping Available</span>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Handmade with Love</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Truck className="w-4 h-4" />
            <span>Safe & Secure Delivery</span>
          </div>
        </div>
      </div>
    </div>
  )
}
