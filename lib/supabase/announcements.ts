import { createClient } from "./server"

export type Announcement = {
  id: string
  title: string
  message: string
  cta_label?: string
  cta_url?: string
  image_url?: string
  start_date: string
  end_date?: string
  show_on_pages: string[]
  display_frequency: 'every_visit' | 'session' | 'once_per_user'
  popup_style: 'small' | 'medium' | 'full_banner'
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
}

export type CreateAnnouncementData = Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'created_by'>

export async function getAnnouncements() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching announcements:', error)
    return { data: null, error }
  }
  
  return { data: data as Announcement[], error: null }
}

export async function getActiveAnnouncements(currentPage: string = 'homepage') {
  const supabase = await createClient()
  
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .or(`show_on_pages.cs.{all},show_on_pages.cs.{${currentPage}}`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching active announcements:', error)
    return { data: null, error }
  }
  
  return { data: data as Announcement[], error: null }
}

export async function createAnnouncement(announcementData: CreateAnnouncementData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('announcements')
    .insert([announcementData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating announcement:', error)
    return { data: null, error }
  }
  
  return { data: data as Announcement, error: null }
}

export async function updateAnnouncement(id: string, announcementData: Partial<CreateAnnouncementData>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('announcements')
    .update(announcementData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating announcement:', error)
    return { data: null, error }
  }
  
  return { data: data as Announcement, error: null }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting announcement:', error)
    return { error }
  }
  
  return { error: null }
}

export async function toggleAnnouncementStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('announcements')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error toggling announcement status:', error)
    return { data: null, error }
  }
  
  return { data: data as Announcement, error: null }
}
