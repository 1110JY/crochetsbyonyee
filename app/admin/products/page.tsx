"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toggleProductAvailability, toggleProductFeatured, deleteProduct } from "./actions"

import { Product } from "@/lib/supabase/products"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
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

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
      setError("Failed to load products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    setIsProcessing((prev) => ({ ...prev, [id]: true }))
    
    // Optimistic update
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id ? { ...p, is_available: !currentStatus } : p
      )
    )

    try {
      const { success } = await toggleProductAvailability(id, currentStatus)
      if (!success) {
        // Revert on failure
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === id ? { ...p, is_available: currentStatus } : p
          )
        )
        alert("Failed to update product availability. Please try again.")
      }
    } catch (error) {
      console.error("Error toggling availability:", error)
      // Revert on error
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === id ? { ...p, is_available: currentStatus } : p
        )
      )
      alert("An error occurred while updating the product. Please try again.")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    setIsProcessing((prev) => ({ ...prev, [id]: true }))
    
    // Optimistic update
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id ? { ...p, is_featured: !currentStatus } : p
      )
    )

    try {
      const { success } = await toggleProductFeatured(id, currentStatus)
      if (!success) {
        // Revert on failure
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === id ? { ...p, is_featured: currentStatus } : p
          )
        )
        alert("Failed to update product featured status. Please try again.")
      }
    } catch (error) {
      console.error("Error toggling featured status:", error)
      // Revert on error
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === id ? { ...p, is_featured: currentStatus } : p
        )
      )
      alert("An error occurred while updating the product. Please try again.")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsProcessing((prev) => ({ ...prev, [id]: true }))
    
    // Optimistic update
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))

    try {
      const { success } = await deleteProduct(id)
      if (!success) {
        // Revert on failure
        await loadProducts() // Reload all products if delete fails
        alert("Failed to delete product. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      await loadProducts() // Reload all products if delete errors
      alert("An error occurred while deleting the product. Please try again.")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Products</h1>
            <p className="text-slate-600 mt-1">Manage your crochet product catalog</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium">{products.length}</span>
              <span className="ml-1">products total</span>
            </div>
            <Button 
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-3" />
            <span className="text-slate-600">Loading products...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center text-red-800">
            <span className="text-sm">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadProducts}
              className="ml-auto border-red-200 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
              <div className="aspect-square bg-slate-50 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-400 text-xl">🧶</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Header */}
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      {product.categories && (
                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                          {product.categories.name}
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          product.is_available 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {product.is_available ? "Active" : "Inactive"}
                      </Badge>
                      {product.is_featured && (
                        <Badge 
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">
                      {product.price ? `£${product.price.toFixed(2)}` : "Price on request"}
                    </span>
                    <span className="text-slate-500">Stock: {product.stock_quantity}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <Link href={`/products/${product.slug}`} target="_blank">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <Link href={`/admin/products/${product.slug}/edit`}>
                        <Edit className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button
                      size="sm" 
                      variant="outline"
                      disabled={isProcessing[product.id]}
                      onClick={() => handleDelete(product.id)} 
                      className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isProcessing[product.id] ? (
                        <div className="w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-8 md:p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Products Yet</h3>
            <p className="text-slate-600 mb-6">Start building your catalog by adding your first product.</p>
            <Button 
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
