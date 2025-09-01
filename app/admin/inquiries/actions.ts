"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { unstable_noStore as noStore } from 'next/cache'

export async function markInquiryAsRead(id: string) {
  noStore()
  const supabase = await createClient()

  console.log('Marking inquiry as read:', id) // Debug log

  const { data, error } = await supabase
    .from("contact_inquiries")
    .update({ 
      is_read: true,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .select("*") // Select all fields
    .single()

  console.log('Update result:', { data, error }) // Debug log

  if (error) {
    console.error("Error marking inquiry as read:", error)
    return { success: false, error }
  }

  // Force dynamic behavior
  revalidatePath("/admin/inquiries", "layout")
  return { success: true, data }
}

export async function replyToInquiry(id: string, reply: string) {
  noStore()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contact_inquiries")
    .update({ 
      reply: reply,
      replied_at: new Date().toISOString(),
      is_read: true
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error saving reply:", error)
    return { success: false }
  }

  // Force dynamic behavior
  revalidatePath("/admin/inquiries", "layout")
  return { success: true, data }
}
