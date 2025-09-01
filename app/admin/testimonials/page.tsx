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
    <div>
      <AdminHeader title="Testimonials" description="Manage customer testimonials and reviews" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">All Testimonials</h2>
            <p className="text-amber-600">{testimonials.length} testimonials total</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={showAddForm || editingId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="border-amber-200 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="customer_name" className="text-amber-800">
                    Customer Name *
                  </Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                    className="border-amber-200"
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="text-amber-800">
                    Rating *
                  </Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-amber-200 rounded-md"
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
                <Label htmlFor="content" className="text-amber-800">
                  Testimonial Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="border-amber-200"
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
                    className="rounded border-amber-300"
                  />
                  <span className="text-amber-800">Published</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="rounded border-amber-300"
                  />
                  <span className="text-amber-800">Featured</span>
                </label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
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
              <Card key={testimonial.id} className="border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-amber-900">{testimonial.customer_name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={testimonial.is_published ? "default" : "secondary"}>
                            {testimonial.is_published ? "Published" : "Draft"}
                          </Badge>
                          {testimonial.is_featured && <Badge className="bg-amber-600 text-white">Featured</Badge>}
                        </div>
                      </div>

                      <p className="text-amber-700 mb-4 italic">"{testimonial.content}"</p>

                      <p className="text-sm text-amber-600">
                        Added {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => togglePublished(testimonial.id, testimonial.is_published)}
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 bg-transparent"
                      >
                        {testimonial.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 bg-transparent"
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleEdit(testimonial)}
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 bg-transparent"
                        disabled={editingId === testimonial.id || showAddForm}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(testimonial.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 bg-transparent"
                        disabled={editingId === testimonial.id || showAddForm}
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
          <Card className="border-amber-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No Testimonials Yet</h3>
              <p className="text-amber-600 mb-4">Add customer testimonials to build trust and showcase your work.</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
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
