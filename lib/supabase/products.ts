import { createClient } from "./server"

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  category_id: string | null
  images: string[] | null
  materials: string[] | null
  dimensions: string | null
  care_instructions: string | null
  is_featured: boolean
  is_available: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        description
      )
    `)
    .order("created_at", { ascending: false })

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        description
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        name,
        slug,
        description
      )
    `)
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data || []
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

// Actions for managing products
export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("products")
    .insert(product)

  if (error) throw error

  // Revalidate product pages
  await fetch("/api/revalidate?path=/&path=/products", {
    method: "POST"
  })
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)

  if (error) throw error

  // Revalidate product pages
  await fetch("/api/revalidate?path=/&path=/products", {
    method: "POST"
  })
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error

  // Revalidate product pages
  await fetch("/api/revalidate?path=/&path=/products", {
    method: "POST"
  })
}
