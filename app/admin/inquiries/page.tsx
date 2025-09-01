import { createClient } from "@/lib/supabase/server"
import InquiriesList from "./inquiries-list"
import { unstable_noStore as noStore } from 'next/cache'

async function getInquiries() {
  // Opt out of caching for this page
  noStore()
  
  const supabase = await createClient()

  console.log('Fetching inquiries...') // Debug log

  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error('Error fetching inquiries:', error)
  }

  console.log('Fetched inquiries:', data) // Debug log

  return data || []
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries()

  return <InquiriesList initialInquiries={inquiries} />
}
