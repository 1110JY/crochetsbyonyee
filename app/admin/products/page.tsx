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
  const [searchTerm, setSearchTerm] = useState<string>("")

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
      await loadProducts() // Reload all products if delete errors
      alert("An error occurred while deleting the product. Please try again.")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  // derive filtered list once for both table and mobile list
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    return (
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.categories?.name?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Card wrapper */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Products</h1>
            <p className="text-slate-600 mt-1">Manage your crochet product catalog</p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Search / meta */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="text-sm text-slate-600">{products.length} products</div>
          </div>
        </div>

        {/* Mobile list (small screens) */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="mt-4 md:hidden space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-slate-50 rounded-lg border border-slate-100 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400">🧶</span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{product.description}</div>
                    <div className="text-xs text-slate-600 mt-1">{product.price ? `£${product.price.toFixed(2)}` : '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${product.is_available ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    {product.is_available ? 'In stock' : 'Out of stock'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Link href={`/products/${product.slug}`} target="_blank" className="text-slate-500 hover:text-slate-900">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/products/${product.slug}/edit`} className="text-slate-500 hover:text-slate-900">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-slate-500 hover:text-slate-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table (md+) */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="hidden md:block mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Stock</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-400">🧶</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.categories?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-sm text-slate-600 max-w-md">
                      <div className="line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 align-middle text-sm font-semibold text-slate-900">{product.price ? `£${product.price.toFixed(2)}` : '—'}</td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${product.is_available ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {product.is_available ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-right space-x-2">
                      <Link href={`/products/${product.slug}`} target="_blank" className="text-slate-500 hover:text-slate-900">
                        <Eye className="inline-block w-4 h-4" />
                      </Link>
                      <Link href={`/admin/products/${product.slug}/edit`} className="text-slate-500 hover:text-slate-900">
                        <Edit className="inline-block w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="text-slate-500 hover:text-slate-900">
                        <Trash2 className="inline-block w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="mt-6 bg-white rounded-lg border border-slate-200 p-8 md:p-12">
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
    </div>
  )
}
