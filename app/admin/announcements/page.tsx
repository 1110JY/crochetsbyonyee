import { Suspense } from "react"
import { getAnnouncements } from "@/lib/supabase/announcements"
import { Button } from "@/components/ui/button"
import { Plus, Megaphone } from "lucide-react"
import Link from "next/link"
import { AnnouncementsContent } from "./content"

export default async function AnnouncementsPage() {
  const { data: announcements, error } = await getAnnouncements()

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="text-slate-800">
            <span className="text-sm">{error.message || "Failed to load announcements"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Megaphone className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
            <p className="text-slate-600">Create pop-up messages for your customers</p>
          </div>
        </div>
        
        <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white">
          <Link href="/admin/announcements/new">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Link>
        </Button>
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