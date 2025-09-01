"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

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

  const handleSave = async () => {
    const supabase = createClient()

    try {
      if (editingId) {
        // Update existing category
        const { error: updateError } = await supabase.from("categories").update(formData).eq("id", editingId)
        if (updateError) throw updateError
      } else {
        // Create new category
        const slug = formData.slug || generateSlug(formData.name)
        const { error: insertError } = await supabase.from("categories").insert({ ...formData, slug })
        if (insertError) throw insertError
      }

      // Revalidate both the admin page and the main pages that show categories
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
  }

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Categories" description="Manage product categories" />
        <div className="p-6">
          <div className="text-center py-8">Loading categories...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader title="Categories" description="Manage product categories" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">All Categories</h2>
            <p className="text-muted-foreground">{categories.length} categories total</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
            disabled={showAddForm || editingId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 mb-6">
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif font-light text-foreground mb-6">
                {editingId ? "Edit Category" : "Add New Category"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">
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
                    className="border-primary/20 focus:border-primary/30"
                    placeholder="e.g., Baby Items"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-amber-800">
                    Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="border-amber-200"
                    placeholder="e.g., baby-items"
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="description" className="text-amber-800">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="border-amber-200"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="image_url" className="text-amber-800">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  className="border-amber-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-foreground mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">/{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-muted-foreground/80 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(category)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                      disabled={editingId === category.id || showAddForm}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(category.id)}
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 hover:border-destructive/50 text-destructive hover:text-destructive"
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
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-light text-foreground mb-2">No Categories Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first product category to get started.</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-primary/90 hover:bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
