"use client"

import { AdminHeader } from "@/components/admin/admin-header"
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <AdminHeader 
          title="Edit Product" 
          description="Update product details" 
        />
        <div className="max-w-3xl mx-auto px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-r-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader 
        title="Edit Product" 
        description="Update product details" 
      />

      <div className="max-w-3xl mx-auto px-8 pb-16">
        <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cozy Winter Blanket"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product..."
                    className="h-32"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="images">Product Images</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary/20 hover:border-primary/30 relative"
                      disabled={isLoading}
                    >
                      {isLoading ? "Uploading..." : "Add Images"}
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                      />
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Upload product images (PNG, JPG, max 10MB each)
                    </p>
                  </div>

                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (£)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category_id || ""} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {categories.length === 0 && (
                        <SelectItem value="create" disabled>
                          No categories available - Create one first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="materials">Materials (comma-separated)</Label>
                  <Input
                    id="materials"
                    value={formData.materials?.join(", ") || ""}
                    onChange={(e) => handleMaterialsChange(e.target.value)}
                    placeholder="e.g., Cotton yarn, Polyester filling"
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 40cm x 60cm"
                  />
                </div>

                <div>
                  <Label htmlFor="care">Care Instructions</Label>
                  <Textarea
                    id="care"
                    value={formData.care_instructions || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
                    placeholder="e.g., Hand wash cold, lay flat to dry"
                    className="h-20"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                      className="rounded border-primary/20"
                    />
                    <span className="text-sm text-muted-foreground">Available for Purchase</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded border-primary/20"
                    />
                    <span className="text-sm text-muted-foreground">Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-primary/20 hover:border-primary/30"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary/90 hover:bg-primary text-primary-foreground"
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
