"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Product, Category } from "@/lib/supabase/products"
import { toast } from "sonner"
import Link from "next/link"

// In Next.js 14+, route params are passed as a Promise that needs to be unwrapped
// using React.use() before accessing. This helps with server components and
// async data handling.
export default function EditProductPage({
  params: rawParams,
}: {
  params: Promise<{ slug: string }>
}) {
  const params = use(rawParams) // Unwrap the params Promise
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: null,
    category_id: null,
    materials: [],
    dimensions: "",
    care_instructions: "",
    is_featured: false,
    is_available: true,
    stock_quantity: 1,
    images: []
  })

  useEffect(() => {
    loadCategories()
    loadProduct()
  }, [params.slug])

  const loadCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
      toast.error("Failed to load categories")
    }
  }

  const loadProduct = async () => {
    try {
      const supabase = createClient()
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", params.slug)
        .single()

      if (error) throw error
      if (!product) {
        toast.error("Product not found")
        router.push("/admin/products")
        return
      }

      setFormData(product)
    } catch (error) {
      console.error("Error loading product:", error)
      toast.error("Failed to load product")
      router.push("/admin/products")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Create slug from name if name changed
      const slug = formData.name?.toLowerCase().replace(/\s+/g, "-") || ""

      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          slug,
          price: formData.price ? parseFloat(formData.price.toString()) : null,
          stock_quantity: parseInt(formData.stock_quantity?.toString() || "1"),
          materials: formData.materials?.filter(Boolean) || [],
        })
        .eq("slug", params.slug)

      if (error) throw error

      // Revalidate product pages
      await fetch("/api/revalidate?path=/&path=/products", {
        method: "POST"
      })

      toast.success("Product updated successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaterialsChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      materials: value.split(",").map(m => m.trim()).filter(Boolean)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    const newImages: string[] = []

    try {
      const supabase = createClient()
      
      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`

        // Upload the file to Supabase storage
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        newImages.push(publicUrl)
      }

      // Update form data with new images
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }))

      toast.success("Images uploaded successfully")
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove) || []
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-6">
        <div className="w-full ml-0">
            <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Edit Product</h1>
                  <p className="text-slate-600 mt-1">Update product details</p>
                </div>
                <div>
                  <Button asChild variant="outline" className="border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg">
                    <Link href="/admin/products">Back to products</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

  <div className="w-full ml-0 px-6 py-16">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-900 border-r-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-6">
        <div className="w-full ml-0">
          <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Edit Product</h1>
                <p className="text-slate-600 mt-1">Update product details</p>
              </div>
              <div>
                <Button asChild variant="outline" className="border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg">
                  <Link href="/admin/products">Back to products</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

  <div className="w-full ml-0 px-2 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* Main Form column */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8 text-left">
          {/* Basic Info */}
          <Card className="bg-white/90 border-slate-200 shadow-md">
            <CardContent className="p-6 space-y-6">
              <div className="text-left">
                <h2 className="text-lg font-semibold text-slate-900 mb-2 text-left">Basic Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <Label htmlFor="name" className="text-slate-900 font-medium text-left mb-1">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Cozy Winter Blanket"
                      className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 text-base rounded-lg text-left"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <Label htmlFor="category" className="text-slate-900 font-medium text-left mb-1">Category</Label>
                    <Select 
                      value={formData.category_id || ""} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                      required
                    >
                      <SelectTrigger className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white rounded-lg text-left">
                        <SelectValue placeholder="Select a category" className="placeholder:text-gray-400 text-left text-black" style={{ color: '#000000' }} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-300 shadow-lg text-left">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 text-left">
                            {category.name}
                          </SelectItem>
                        ))}
                        {categories.length === 0 && (
                          <SelectItem value="create" disabled className="text-slate-500 text-left">
                            No categories available - Create one first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6 text-left">
                  <Label htmlFor="description" className="text-slate-900 font-medium text-left mb-1">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product..."
                    className="h-28 text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 rounded-lg text-left"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-white/90 border-slate-200 shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Product Images</h2>
              <p className="text-sm text-slate-600">Add clear photos that show the product and important details. Drag & drop or click to select files.</p>

              <label htmlFor="images" className="block">
                <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 transition-colors bg-slate-50">
                  <div className="text-slate-700 font-medium">Drag & drop images here</div>
                  <div className="text-sm text-slate-500 mt-1">PNG or JPG — up to 10MB each</div>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
              </label>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-slate-900 hover:bg-slate-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="bg-white/90 border-slate-200 shadow-md">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price" className="text-slate-900 font-medium mb-1">Price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                    placeholder="0.00"
                    className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-slate-900 font-medium mb-1">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                    min="0"
                    className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="materials" className="text-slate-900 font-medium mb-1">Materials</Label>
                  <Input
                    id="materials"
                    value={formData.materials?.join(", ") || ""}
                    onChange={(e) => handleMaterialsChange(e.target.value)}
                    placeholder="e.g., Cotton yarn, Polyester filling"
                    className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 rounded-lg"
                  />
                  <span className="text-xs text-slate-500">Separate with commas</span>
                </div>
                <div>
                  <Label htmlFor="dimensions" className="text-slate-900 font-medium mb-1">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 40cm x 60cm"
                    className="text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="care" className="text-slate-900 font-medium mb-1">Care Instructions</Label>
                  <Textarea
                    id="care"
                    value={formData.care_instructions || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
                    placeholder="e.g., Hand wash cold, lay flat to dry"
                    className="h-20 text-slate-900 border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="bg-white/90 border-slate-200 shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Status</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                    className="rounded border-slate-300"
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  <span className="text-sm text-slate-700">Available for Purchase</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded border-slate-300"
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  <span className="text-sm text-slate-700">Featured Product</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-left float-left justify-end gap-4 sticky bottom-0 bg-slate-50 py-4 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-8 py-2 text-base font-semibold shadow-md transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>

        {/* Live Preview Sidebar */}
        <aside className="hidden md:block md:col-span-1 sticky top-28 self-start text-left">
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col items-start gap-4">
            <div className="w-32 h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
              {formData.images && formData.images.length > 0 ? (
                <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-4xl">🧶</span>
              )}
            </div>
            <div className="w-full text-left">
              <div className="text-lg font-bold text-slate-900 truncate">{formData.name || "Product Name"}</div>
              <div className="text-base text-slate-700 mt-1">{formData.price ? `£${formData.price}` : "Price"}</div>
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-100">
                {formData.is_available ? "Available" : "Unavailable"}
              </div>
              {formData.is_featured && (
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 ml-2">
                  Featured
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
