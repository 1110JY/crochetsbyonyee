import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentPage = searchParams.get('page') || 'homepage'
    
    const supabase = await createClient()
    const now = new Date().toISOString()
    
    // First get all active announcements within date range
    const { data: activeAnnouncements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Filter by page targeting in JavaScript since Supabase array queries can be tricky
    const filteredAnnouncements = activeAnnouncements?.filter(announcement => {
      const pages = announcement.show_on_pages || []
      return pages.includes('all') || pages.includes(currentPage)
    }) || []
    
    return NextResponse.json({ data: filteredAnnouncements })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
