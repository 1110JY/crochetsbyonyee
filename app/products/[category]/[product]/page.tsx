import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProductBySlug } from "@/lib/supabase/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Heart, Share2, Package, Palette, Ruler, Sparkles } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product: productSlug } = await params
  const product = await getProductBySlug(productSlug)

  if (!product) {
    notFound()
  }

  const primaryImage = product.images?.[0] || "/crochet-item.png"
  const formattedPrice = product.price ? `£${product.price.toFixed(2)}` : "Price on request"

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Navigation />

      {/* Breadcrumb */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button asChild variant="ghost" className="text-amber-700 hover:text-amber-600 mb-4">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-white border border-amber-200">
                <img
                  src={primaryImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-white border border-amber-200"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.categories && (
                  <Badge variant="outline" className="border-amber-300 text-amber-700 mb-3">
                    {product.categories.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-amber-900">{formattedPrice}</span>
                  {product.is_featured && <Badge className="bg-amber-600 text-white">Featured</Badge>}
                </div>
              </div>

              {product.description && (
                <div>
                  <p className="text-amber-700 text-lg leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white flex-1">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <Separator className="bg-amber-200" />

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-900">Product Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.materials && product.materials.length > 0 && (
                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Palette className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-amber-900">Materials</span>
                        </div>
                        <p className="text-amber-700 text-sm">{product.materials.join(", ")}</p>
                      </CardContent>
                    </Card>
                  )}

                  {product.dimensions && (
                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Ruler className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-amber-900">Dimensions</span>
                        </div>
                        <p className="text-amber-700 text-sm">{product.dimensions}</p>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-900">Availability</span>
                      </div>
                      <p className="text-amber-700 text-sm">
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Made to order"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-900">Handmade</span>
                      </div>
                      <p className="text-amber-700 text-sm">Crafted with love and attention to detail</p>
                    </CardContent>
                  </Card>
                </div>

                {product.care_instructions && (
                  <Card className="border-amber-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-amber-900 mb-2">Care Instructions</h4>
                      <p className="text-amber-700 text-sm">{product.care_instructions}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Footer */}
      <footer className="bg-amber-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-amber-700">
          © 2023 Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
