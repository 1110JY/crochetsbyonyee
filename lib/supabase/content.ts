import { createClient } from "@/lib/supabase/server"

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  type: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  content: string
  rating: number
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  images?: string[]
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = await createClient()

  const { data } = await supabase.from("site_settings").select("key, value")

  if (!data) return {}

  return data.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value || ""
      return acc
    },
    {} as Record<string, string>,
  )
}

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
  const supabase = await createClient()

  let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false })

  if (publishedOnly) {
    query = query.eq("is_published", true)
  }

  const { data } = await query

  return data || []
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return data || []
}
