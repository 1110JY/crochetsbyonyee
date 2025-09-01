"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Star, Eye, EyeOff } from "lucide-react"

interface Testimonial {
  id: string
  customer_name: string
  content: string
  rating: number
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: "",
    content: "",
    rating: 5,
    is_featured: false,
    is_published: true,
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

    if (data) {
      setTestimonials(data)
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()

    try {
      if (editingId) {
        // Update existing testimonial
        await supabase.from("testimonials").update(formData).eq("id", editingId)
      } else {
        // Create new testimonial
        await supabase.from("testimonials").insert(formData)
      }

      await loadTestimonials()
      setEditingId(null)
      setShowAddForm(false)
      setFormData({
        customer_name: "",
        content: "",
        rating: 5,
        is_featured: false,
        is_published: true,
      })
    } catch (error) {
      console.error("Error saving testimonial:", error)
      alert("Error saving testimonial. Please try again.")
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      customer_name: testimonial.customer_name,
      content: testimonial.content,
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
      is_published: testimonial.is_published,
    })
    setEditingId(testimonial.id)
    setShowAddForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    const supabase = createClient()
    await supabase.from("testimonials").delete().eq("id", id)
    await loadTestimonials()
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from("testimonials").update({ is_published: !currentStatus }).eq("id", id)
    await loadTestimonials()
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from("testimonials").update({ is_featured: !currentStatus }).eq("id", id)
    await loadTestimonials()
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({
      customer_name: "",
      content: "",
      rating: 5,
      is_featured: false,
      is_published: true,
    })
  }

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Testimonials" description="Manage customer testimonials and reviews" />
        <div className="p-6">
          <div className="text-center py-8">Loading testimonials...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader title="Testimonials" description="Manage customer testimonials and reviews" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">All Testimonials</h2>
            <p className="text-muted-foreground">{testimonials.length} testimonials total</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
            disabled={showAddForm || editingId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 mb-6">
            <CardContent className="p-6">
              <h3 className="text-2xl font-serif font-light text-foreground mb-6">
                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="customer_name" className="text-foreground">
                    Customer Name *
                  </Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                    className="border-primary/20 focus:border-primary/30"
                    placeholder="e.g., Shrek"
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="text-foreground">
                    Rating *
                  </Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-primary/20 focus:border-primary/30 rounded-md bg-white/50"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="content" className="text-foreground">
                  Testimonial Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="border-primary/20 focus:border-primary/30"
                  rows={4}
                  placeholder="What did the customer say about your work?"
                />
              </div>
              <div className="flex items-center space-x-6 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Published</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">Featured</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-primary/90 hover:bg-primary text-primary-foreground">
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

        {/* Testimonials List */}
        {testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-serif text-foreground">{testimonial.customer_name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Badge 
                            variant="outline" 
                            className={testimonial.is_published 
                              ? "border-primary/20 text-primary"
                              : "border-muted text-muted-foreground"
                            }
                          >
                            {testimonial.is_published ? "Published" : "Draft"}
                          </Badge>
                          {testimonial.is_featured && (
                            <Badge 
                              variant="outline"
                              className="border-secondary/20 text-secondary"
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>

                      <p className="text-sm text-muted-foreground">
                        Added {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => togglePublished(testimonial.id, testimonial.is_published)}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                      >
                        {testimonial.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                      >
                        <Star className={`w-3 h-3 ${testimonial.is_featured ? "fill-primary" : ""}`} />
                      </Button>
                      <Button
                        onClick={() => handleEdit(testimonial)}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                        disabled={!!editingId || showAddForm}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(testimonial.id)}
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 hover:border-destructive/50 text-destructive hover:text-destructive"
                        disabled={!!editingId || showAddForm}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-light text-foreground mb-2">No Testimonials Yet</h3>
              <p className="text-muted-foreground mb-6">Add customer testimonials to build trust and showcase your work.</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-primary/90 hover:bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Testimonial
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
