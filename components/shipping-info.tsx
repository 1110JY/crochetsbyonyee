"use client"

import { Truck, Clock, Shield, Globe2 } from "lucide-react"

export function ShippingInfo() {
  return (
    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-mochiy text-foreground mb-4">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3">
          <Globe2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground font-mochiy-p">Worldwide Shipping</h4>
            <p className="text-sm text-muted-foreground">We ship to customers around the globe</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground font-mochiy-p">Processing Time</h4>
            <p className="text-sm text-muted-foreground">2-5 business days to prepare your order</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Truck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground font-mochiy-p">Delivery</h4>
            <p className="text-sm text-muted-foreground">5-15 business days (varies by location)</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground font-mochiy-p">Safe Packaging</h4>
            <p className="text-sm text-muted-foreground">Carefully packaged to ensure safe arrival</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-primary">💝 Special Note:</span> Each item is lovingly handmade to order. 
          Shipping costs will be calculated based on your location during checkout.
        </p>
      </div>
    </div>
  )
}
