import { Suspense } from "react"
import { getAnnouncements } from "@/lib/supabase/announcements"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AnnouncementsContent } from "./content"

export default async function AnnouncementsPage() {
  const { data: announcements, error } = await getAnnouncements()

  if (error) {
    return (
      <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center text-slate-800">
            <span className="text-sm">{error.message || "Failed to load announcements"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Popup Announcements</h1>
            <p className="text-slate-600 mt-1">Create and manage popup announcements for your website visitors</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium">{announcements?.length || 0}</span>
              <span className="ml-1">announcements total</span>
            </div>
            <Button 
              asChild
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Link href="/admin/announcements/new">
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-3" />
            <span className="text-slate-600">Loading announcements...</span>
          </div>
        </div>
      }>
        <AnnouncementsContent initialAnnouncements={announcements || []} />
      </Suspense>
    </div>
  )
}