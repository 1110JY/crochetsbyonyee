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

export async function getActiveAnnouncementsClient(currentPage: string = 'homepage') {
  try {
    const url = `/api/announcements/active?page=${encodeURIComponent(currentPage)}`
    console.log('Fetching from URL:', url) // Debug log
    
    const response = await fetch(url)
    const result = await response.json()
    
    console.log('API Response:', result) // Debug log
    
    if (!response.ok) {
      console.error('API Error:', result.error) // Debug log
      return { data: null, error: { message: result.error } }
    }
    
    return { data: result.data as Announcement[], error: null }
  } catch (error) {
    console.error('Error fetching active announcements:', error)
    return { data: null, error: { message: 'Failed to fetch announcements' } }
  }
}

export async function getAnnouncementByIdClient(id: string) {
  try {
    const response = await fetch(`/api/announcements/${id}`)
    const result = await response.json()
    
    if (!response.ok) {
      return { data: null, error: { message: result.error } }
    }
    
    return { data: result.data as Announcement, error: null }
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return { data: null, error: { message: 'Failed to fetch announcement' } }
  }
}

export async function createAnnouncementClient(announcementData: CreateAnnouncementData) {
  try {
    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcementData),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return { data: null, error: { message: result.error } }
    }
    
    return { data: result.data as Announcement, error: null }
  } catch (error) {
    console.error('Error creating announcement:', error)
    return { data: null, error: { message: 'Failed to create announcement' } }
  }
}

export async function updateAnnouncementClient(id: string, announcementData: Partial<CreateAnnouncementData>) {
  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcementData),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return { data: null, error: { message: result.error } }
    }
    
    return { data: result.data as Announcement, error: null }
  } catch (error) {
    console.error('Error updating announcement:', error)
    return { data: null, error: { message: 'Failed to update announcement' } }
  }
}

export async function deleteAnnouncementClient(id: string) {
  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: 'DELETE',
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return { error: { message: result.error } }
    }
    
    return { error: null }
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return { error: { message: 'Failed to delete announcement' } }
  }
}

export async function toggleAnnouncementStatusClient(id: string, isActive: boolean) {
  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      return { data: null, error: { message: result.error } }
    }
    
    return { data: result.data as Announcement, error: null }
  } catch (error) {
    console.error('Error toggling announcement status:', error)
    return { data: null, error: { message: 'Failed to toggle announcement status' } }
  }
}
