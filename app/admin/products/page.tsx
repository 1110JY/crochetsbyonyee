import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

async function getProducts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <AdminHeader title="Products" description="Manage your crochet product catalog" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">All Products</h2>
            <p className="text-amber-600">{products.length} products total</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-amber-200">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🧶</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900 mb-1 line-clamp-1">{product.name}</h3>
                      {product.categories && (
                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 mb-2">
                          {product.categories.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={product.is_available ? "default" : "secondary"} className="text-xs">
                        {product.is_available ? "Active" : "Inactive"}
                      </Badge>
                      {product.is_featured && <Badge className="bg-amber-600 text-white text-xs">Featured</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-amber-900">
                      {product.price ? `£${product.price.toFixed(2)}` : "Price on request"}
                    </span>
                    <span className="text-sm text-amber-600">Stock: {product.stock_quantity}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-amber-300 text-amber-700 bg-transparent"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 bg-transparent">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 bg-transparent">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-amber-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No Products Yet</h3>
              <p className="text-amber-600 mb-4">Start building your catalog by adding your first product.</p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
