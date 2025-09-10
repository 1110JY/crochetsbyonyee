"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, FolderOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("categories").select("*").order("name")

    if (data) {
      setCategories(data)
    }
    setIsLoading(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleImageUpload = async (file: File) => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `categories/${fileName}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSave = async () => {
    const supabase = createClient()

    try {
      let imageUrl = formData.image_url

      // Handle image upload if there's a new image
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage)
      }

      const dataToSave = {
        ...formData,
        image_url: imageUrl
      }

      if (editingId) {
        // Update existing category
        const { error: updateError } = await supabase
          .from("categories")
          .update(dataToSave)
          .eq("id", editingId)
        if (updateError) throw updateError
      } else {
        // Create new category
        const slug = formData.slug || generateSlug(formData.name)
        const { error: insertError } = await supabase
          .from("categories")
          .insert({ ...dataToSave, slug })
        if (insertError) throw insertError
      }

      // Revalidate pages
      try {
        const res = await fetch("/api/revalidate?path=/&path=/products&path=/admin/categories", {
          method: "POST"
        });
        if (!res.ok) throw new Error("Failed to revalidate");
      } catch (e) {
        console.error("Failed to revalidate pages:", e);
      }

      await loadCategories()
      setEditingId(null)
      setShowAddForm(false)
      setFormData({ name: "", slug: "", description: "", image_url: "" })
      setSelectedImage(null)
      setImagePreview("")
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Error saving category. Please try again.")
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setEditingId(category.id)
    setShowAddForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    const supabase = createClient()
    await supabase.from("categories").delete().eq("id", id)
    await loadCategories()
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ name: "", slug: "", description: "", image_url: "" })
    setSelectedImage(null)
    setImagePreview("")
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-3" />
            <span className="text-slate-600">Loading categories...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Categories</h1>
            <p className="text-slate-600 mt-1">Organize your products into categories</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium">{categories.length}</span>
              <span className="ml-1">categories total</span>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!!showAddForm || !!editingId}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              {editingId ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: prev.slug || generateSlug(name),
                    }))
                  }}
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  placeholder="e.g., Baby Items"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-slate-700 font-medium">
                  Slug *
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  placeholder="e.g., baby-items"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-slate-700 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                rows={3}
                placeholder="Brief description of this category"
              />
            </div>
            
            <div>
              <Label htmlFor="image" className="text-slate-700 font-medium">
                Category Image
              </Label>
              <div className="mt-2 space-y-4">
                {(imagePreview || formData.image_url) && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 p-1 h-6 w-6 bg-white/90 hover:bg-white border-slate-200"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview("")
                        setFormData(prev => ({ ...prev, image_url: "" }))
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedImage(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Create"} Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">/{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{category.description}</p>
                    )}
                    {category.image_url && (
                      <div className="mt-3">
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <Button
                    onClick={() => handleEdit(category)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    disabled={editingId === category.id || showAddForm}
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(category.id)}
                    size="sm"
                    variant="outline"
                    className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    disabled={editingId === category.id || showAddForm}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories yet</h3>
            <p className="text-slate-600 mb-6">Create your first product category to get started organizing your inventory.</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
