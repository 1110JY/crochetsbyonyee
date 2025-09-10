import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AnnouncementPopup } from "@/components/announcement-popup"

interface PreviewAnnouncementPageProps {
  params: {
    id: string
  }
}

export default async function PreviewAnnouncementPage({ params }: PreviewAnnouncementPageProps) {
  const supabase = await createClient()
  
  const { data: announcement, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !announcement) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
            <Link href="/admin/announcements">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Announcements
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Preview Announcement</h1>
          <p className="text-slate-600 mt-1">See how your announcement will appear to users</p>
        </div>
      </div>

      {/* Preview Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Announcement Preview</h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-slate-500">Title:</span>
            <p className="text-slate-900">{announcement.title}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-500">Message:</span>
            <p className="text-slate-900">{announcement.message}</p>
          </div>
          {announcement.cta_label && (
            <div>
              <span className="text-sm font-medium text-slate-500">Button Text:</span>
              <p className="text-slate-900">{announcement.cta_label}</p>
            </div>
          )}
          {announcement.cta_url && (
            <div>
              <span className="text-sm font-medium text-slate-500">Button URL:</span>
              <p className="text-slate-900">{announcement.cta_url}</p>
            </div>
          )}
          {announcement.image_url && (
            <div>
              <span className="text-sm font-medium text-slate-500">Image:</span>
              <img 
                src={announcement.image_url} 
                alt="Preview" 
                className="mt-2 max-w-xs rounded-lg border border-slate-200"
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">
            This announcement will appear as a {announcement.popup_style === 'small' ? 'small toast' : announcement.popup_style === 'medium' ? 'medium modal' : 'full banner'} popup.
          </p>
          <Button 
            onClick={() => {
              // Force show the popup for preview
              const event = new CustomEvent('forceShowAnnouncement', {
                detail: { announcement }
              });
              window.dispatchEvent(event);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Show Preview Popup
          </Button>
        </div>
      </div>

      {/* Hidden popup component for preview */}
      <div style={{ display: 'none' }}>
        <AnnouncementPopup />
      </div>
    </div>
  )
}
