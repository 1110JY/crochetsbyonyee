import { createClient } from "@supabase/supabase-js"

export const staticClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getStaticProducts() {
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
