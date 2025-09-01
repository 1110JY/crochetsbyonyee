"use client"

import { AdminHeader } from "@/components/admin/admin-header"
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader title="Products" description="Manage your crochet product catalog" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">All Products</h2>
            <p className="text-muted-foreground">{products.length} products total</p>
          </div>
          <Button 
            asChild
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">🧶</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-foreground mb-1 line-clamp-1">{product.name}</h3>
                      {product.categories && (
                        <Badge variant="outline" className="text-xs border-primary/20 text-primary mb-2">
                          {product.categories.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          product.is_available 
                            ? "border-primary/20 text-primary" 
                            : "border-muted text-muted-foreground"
                        }`}
                      >
                        {product.is_available ? "Active" : "Inactive"}
                      </Badge>
                      {product.is_featured && (
                        <Badge 
                          variant="outline"
                          className="text-xs border-secondary/20 text-secondary ml-1"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-serif text-foreground">
                      {product.price ? `£${product.price.toFixed(2)}` : "Price on request"}
                    </span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
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
                      className="border-destructive/30 hover:border-destructive/50 text-destructive hover:text-destructive"
                    >
                      {isProcessing[product.id] ? (
                        <div className="w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-light text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-6">Start building your catalog by adding your first product.</p>
              <Button 
                asChild
                className="bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                <Link href="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
