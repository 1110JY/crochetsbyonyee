"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/price-display"
import type { Product } from "@/lib/supabase/products"
import { useCart } from "./cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || "/crochet-item.png"
  const { addItem, setOpen } = useCart()

  return (
    <div className="group">
      <div className="aspect-square relative overflow-hidden mb-4">
        <img
          src={primaryImage || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      <div className="text-center">
        <h3 className="font-mochiy text-xl text-primary mb-2">{product.name}</h3>
        <PriceDisplay 
          price={product.price} 
          className="text-muted-foreground mb-4 font-mochiy-p"
        />

        <div className="flex gap-3 justify-center">
          <Button onClick={() => addItem({ id: product.id, name: product.name, price: product.price || 0, image: primaryImage, slug: product.slug })} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 rounded-full">Add to cart</Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-6 rounded-full">
            <Link href={`/products/${product.categories?.slug || 'uncategorized'}/${product.slug}`}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
