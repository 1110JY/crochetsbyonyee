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
  const [searchTerm, setSearchTerm] = useState<string>("")
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

  const formatDate = (iso?: string) => {
    if (!iso) return "-"
    try {
      return new Date(iso).toLocaleDateString()
    } catch {
      return iso
    }
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
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 placeholder:text-gray-400 text-slate-900"
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
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 placeholder:text-gray-400 text-slate-900"
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
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 placeholder:text-gray-400 text-slate-900"
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
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 p-1 h-6 w-6 bg-white/95 hover:bg-white border-slate-300 hover:border-slate-400"
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
                  className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 text-slate-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
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
      <div className="mt-4">
        <div className="w-full">
          <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-4">
            <div className="flex items-center gap-4">
              <Input
                type="search"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400"
              />
              <div className="text-sm text-slate-600 ml-auto">{categories.length} categories</div>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="w-full mt-6">
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
          </div>
        ) : (
          <div className="w-full mt-6 space-y-4">
            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {categories
                .filter((c) => {
                  const t = searchTerm.trim().toLowerCase()
                  if (!t) return true
                  return (
                    c.name.toLowerCase().includes(t) ||
                    c.slug.toLowerCase().includes(t) ||
                    (c.description || "").toLowerCase().includes(t)
                  )
                })
                .map((category) => (
                  <Card key={category.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {category.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded-md border border-slate-200" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">📁</div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate">{category.name}</div>
                            <div className="text-xs text-slate-500">/{category.slug}</div>
                            {category.description && <div className="text-sm text-slate-600 line-clamp-2 mt-2">{category.description}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="border-slate-200 text-slate-600" onClick={() => handleEdit(category)} disabled={editingId === category.id || showAddForm}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-200 text-slate-600" onClick={() => handleDelete(category.id)} disabled={editingId === category.id || showAddForm}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Table for md+ */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="text-sm text-slate-600">Showing {categories.length} categories</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Created</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {categories
                      .filter((c) => {
                        const t = searchTerm.trim().toLowerCase()
                        if (!t) return true
                        return (
                          c.name.toLowerCase().includes(t) ||
                          c.slug.toLowerCase().includes(t) ||
                          (c.description || "").toLowerCase().includes(t)
                        )
                      })
                      .map((category) => (
                        <tr key={category.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                                {category.image_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-slate-400">📁</span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{category.name}</div>
                                <div className="text-xs text-slate-500">/{category.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle text-sm text-slate-600 max-w-md">
                            <div className="line-clamp-2">{category.description}</div>
                          </td>
                          <td className="px-6 py-4 align-middle text-sm text-slate-700">{formatDate(category.created_at)}</td>
                          <td className="px-6 py-4 align-middle text-right space-x-2">
                            <Button onClick={() => handleEdit(category)} size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50" disabled={editingId === category.id || showAddForm}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => handleDelete(category.id)} size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50" disabled={editingId === category.id || showAddForm}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
