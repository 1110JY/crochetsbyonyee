import { createClient } from "@/lib/supabase/server"

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("No user found")
      return false
    }

    // Use the REST API directly to avoid RLS issues
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error("Error checking admin access:", error)
      return false
    }

    console.log("Profile data:", data)
    return data?.role === 'admin'
  } catch (error) {
    console.error("Exception in checkAdminAccess:", error)
    return false
  }
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return { user, profile }
}
