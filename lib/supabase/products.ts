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

export async function getProducts(categorySlug?: string, sortBy?: string): Promise<Product[]> {
  try {
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

    // Filter by category if provided
    if (categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single()

      if (category) {
        query = query.eq("category_id", category.id)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "alphabetical":
        query = query.order("name", { ascending: true })
        break
      case "newest":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
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
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
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
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
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
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return []
  }
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
