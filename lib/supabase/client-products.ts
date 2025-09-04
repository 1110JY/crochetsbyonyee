import { createClient } from "./client"
import type { Product, Category } from "./products"

export async function getProductsClient(categorySlug?: string, sortBy?: string): Promise<Product[]> {
  const supabase = createClient()
  
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
}

export async function getCategoriesClient(): Promise<Category[]> {
  const supabase = createClient()
  
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
