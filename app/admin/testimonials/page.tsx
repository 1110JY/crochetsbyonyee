"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="px-6 py-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold text-slate-900">Testimonials</h1>
              <p className="text-slate-600 mt-1">Manage customer testimonials and reviews</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-8 text-slate-600">Loading testimonials...</div>
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Testimonials</h1>
            <p className="text-slate-600 mt-1">Manage customer testimonials and reviews</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium">{testimonials.length}</span>
              <span className="ml-1">testimonials total</span>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={showAddForm || editingId !== null}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Testimonial
            </Button>
          </div>
        </div>
      </div>

      {/* Pending Reviews Notice */}
      {testimonials.filter(t => !t.is_published).length > 0 && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Pending Reviews ({testimonials.filter(t => !t.is_published).length})
            </h3>
            <p className="text-slate-800 text-sm">Some testimonials are unpublished and may need your review.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5" />
              {editingId ? "Edit Testimonial" : "Add New Testimonial"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name" className="text-slate-700 font-medium">
                  Customer Name *
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 placeholder:text-gray-400"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>
              <div>
                <Label htmlFor="rating" className="text-slate-700 font-medium">
                  Rating *
                </Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number.parseInt(e.target.value) }))}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:border-slate-400 focus:ring-slate-400 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="content" className="text-slate-700 font-medium">
                Testimonial Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 placeholder:text-gray-400"
                rows={4}
                placeholder="Customer's feedback about your products or service..."
              />
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                  className="h-4 w-4 text-slate-900 focus:ring-slate-400 border-slate-300 rounded"
                />
                <Label htmlFor="is_featured" className="text-slate-700 font-medium">
                  Featured Testimonial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                  className="h-4 w-4 text-slate-900 focus:ring-slate-400 border-slate-300 rounded"
                />
                <Label htmlFor="is_published" className="text-slate-700 font-medium">
                  Publish Immediately
                </Label>
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
              <Button 
                onClick={handleSave} 
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Create"} Testimonial
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List */}
      {testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-slate-200 hover:border-slate-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-slate-900">{testimonial.customer_name}</h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-slate-400 text-slate-400" />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Badge 
                          variant="outline" 
                          className={testimonial.is_published 
                            ? "border-slate-400 text-slate-800 bg-slate-100"
                            : "border-slate-200 text-slate-600 bg-slate-50"
                          }
                        >
                          {testimonial.is_published ? "Published" : "Draft"}
                        </Badge>
                        {testimonial.is_featured && (
                          <Badge 
                            variant="outline"
                            className="border-slate-500 text-slate-900 bg-slate-200"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4 italic">"{testimonial.content}"</p>

                    <p className="text-sm text-slate-500">
                      Added {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => togglePublished(testimonial.id, testimonial.is_published)}
                      size="sm"
                      variant="outline"
                      className="border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                    >
                      {testimonial.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                      size="sm"
                      variant="outline"
                      className="border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                    >
                      <Star className={`w-3 h-3 ${testimonial.is_featured ? "fill-slate-400 text-slate-400" : ""}`} />
                    </Button>
                    <Button
                      onClick={() => handleEdit(testimonial)}
                      size="sm"
                      variant="outline"
                      className="border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
                      disabled={editingId !== null || showAddForm}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(testimonial.id)}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-700"
                      disabled={editingId !== null || showAddForm}
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
        <Card className="bg-white border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Testimonials Yet</h3>
            <p className="text-slate-600 mb-6">Add customer testimonials to build trust and showcase your work.</p>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
