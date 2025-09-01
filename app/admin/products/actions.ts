"use client"

import { createClient } from "@/lib/supabase/client"

export async function toggleProductAvailability(id: string, currentStatus: boolean) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from("products")
      .update({ is_available: !currentStatus })
      .eq("id", id)
    
    if (error) throw error

    // Revalidate pages
    await fetch("/api/revalidate?path=/products", {
      method: "POST"
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating product availability:", error)
    return { success: false, error }
  }
}

export async function toggleProductFeatured(id: string, currentStatus: boolean) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !currentStatus })
      .eq("id", id)
    
    if (error) throw error

    // Revalidate pages
    await fetch("/api/revalidate?path=/&path=/products", {
      method: "POST"
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating product featured status:", error)
    return { success: false, error }
  }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
    
    if (error) throw error

    // Revalidate pages
    await fetch("/api/revalidate?path=/&path=/products", {
      method: "POST"
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error }
  }
}
