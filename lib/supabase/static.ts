import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const staticClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function getStaticProducts() {
  // If no Supabase client is available, return empty array
  if (!staticClient) {
    console.warn("Supabase client not available - environment variables missing")
    return []
  }

  const { data, error } = await staticClient
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

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}
