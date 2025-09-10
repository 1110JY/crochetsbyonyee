import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditAnnouncementForm } from "./form"

interface EditAnnouncementPageProps {
  params: {
    id: string
  }
}

export default async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
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
      <EditAnnouncementForm announcement={announcement} />
    </div>
  )
}
