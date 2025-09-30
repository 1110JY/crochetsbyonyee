import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/price-display"
import { CurrencyDisclaimer } from "@/components/currency-disclaimer"
import { ShippingInfo } from "@/components/shipping-info"
import { getProductBySlug } from "@/lib/supabase/products"
import { getStaticProducts } from "@/lib/supabase/static"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getStaticProducts()
  return products.map((product) => ({
    category: product.categories?.slug || 'uncategorized',
    productSlug: product.slug,
  }))
}

export default async function ProductPage({
  params,
}: {
  params: { category: string; productSlug: string }
}) {
  const product = await getProductBySlug(params.productSlug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Back button */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href={`/products/${params.category}`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="aspect-square overflow-hidden rounded-lg border border-primary/20">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.slice(1).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg border border-primary/20"
                      >
                        <img
                          src={image}
                          alt={`${product.name} - Image ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground font-mochiy-p">No product images available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-mochiy text-foreground mb-4">
                {product.name}
              </h1>
              <PriceDisplay 
                price={product.price} 
                className="text-2xl text-foreground font-mochiy-p"
              />
              <div className="mt-3">
                <CurrencyDisclaimer />
              </div>
            </div>

            {/* Availability Badge */}
            <div>
              {product.is_available ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mochiy-p">
                  In Stock • {product.stock_quantity} available
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-mochiy-p">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-zinc max-w-none">
                <h3 className="text-lg font-mochiy text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground font-mochiy-p">{product.description}</p>
              </div>
            )}


            {/* Dimensions */}
            {product.dimensions && (
              <div>
                <h3 className="text-lg font-mochiy text-foreground mb-2">Dimensions</h3>
                <p className="text-muted-foreground font-mochiy-p">{product.dimensions}</p>
              </div>
            )}

            

            {/* Shipping Information */}
            <ShippingInfo />

            {/* Contact Button */}
            <div className="pt-8">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary/90 hover:bg-primary text-primary-foreground rounded-full"
              >
                <Link href="/contact">Enquire About This Item</Link>
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-4 font-mochiy-p">
                Contact us to discuss customisation options or place an order.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
