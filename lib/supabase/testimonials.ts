import { createClient } from "./client"

export interface Testimonial {
  id: string
  customer_name: string
  content: string
  rating: number
  created_at: string
  updated_at: string
  is_featured: boolean
  is_published: boolean
  email?: string
  title?: string
  images?: string[]
  source?: 'admin' | 'customer_review'
}

export async function getTestimonials(limit?: number) {
  const supabase = createClient()
  
  const query = supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)  // Changed from is_featured to is_published
    .order("created_at", { ascending: false })

  if (limit) {
    query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }

  return data as Testimonial[]
}

export async function getAllTestimonials() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all testimonials:", error)
    return []
  }

  return data as Testimonial[]
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "created_at">) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("testimonials")
    .insert([testimonial])
    .select()
    .single()

  if (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }

  return data as Testimonial
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("testimonials")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating testimonial:", error)
    throw error
  }

  return data as Testimonial
}

export async function deleteTestimonial(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }

  return true
}
