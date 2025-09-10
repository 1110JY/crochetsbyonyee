import { Suspense } from "react"
import { NewAnnouncementForm } from "./form"

export default function NewAnnouncementPage() {
  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Create New Announcement</h1>
          <p className="text-slate-600 mt-1">
            Create a popup announcement to engage with your website visitors
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-3" />
            <span className="text-slate-600">Loading form...</span>
          </div>
        </div>
      }>
        <NewAnnouncementForm />
      </Suspense>
    </div>
  )
}
