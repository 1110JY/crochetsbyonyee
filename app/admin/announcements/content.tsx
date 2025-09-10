"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, Plus } from "lucide-react"
import { Announcement, toggleAnnouncementStatusClient, deleteAnnouncementClient } from "@/lib/supabase/announcements-client"
import { toast } from "sonner"
import Link from "next/link"

interface AnnouncementsContentProps {
  initialAnnouncements: Announcement[]
}

export function AnnouncementsContent({ initialAnnouncements }: AnnouncementsContentProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async (announcement: Announcement) => {
    setIsLoading(true)
    const { error } = await toggleAnnouncementStatusClient(announcement.id, !announcement.is_active)
    
    if (error) {
      toast.error("Failed to update announcement status")
    } else {
      setAnnouncements(prev => 
        prev.map(a => 
          a.id === announcement.id 
            ? { ...a, is_active: !a.is_active }
            : a
        )
      )
      toast.success(`Announcement ${!announcement.is_active ? 'activated' : 'deactivated'}`)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!selectedAnnouncement) return
    
    setIsLoading(true)
    const { error } = await deleteAnnouncementClient(selectedAnnouncement.id)
    
    if (error) {
      toast.error("Failed to delete announcement")
    } else {
      setAnnouncements(prev => prev.filter(a => a.id !== selectedAnnouncement.id))
      toast.success("Announcement deleted successfully")
    }
    
    setDeleteDialogOpen(false)
    setSelectedAnnouncement(null)
    setIsLoading(false)
  }

  const getStatusBadge = (announcement: Announcement) => {
    const now = new Date()
    const startDate = new Date(announcement.start_date)
    const endDate = announcement.end_date ? new Date(announcement.end_date) : null

    if (!announcement.is_active) {
      return <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-slate-300">Inactive</Badge>
    }
    
    if (startDate > now) {
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">Scheduled</Badge>
    }
    
    if (endDate && endDate < now) {
      return <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-slate-300">Expired</Badge>
    }
    
    return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">Active</Badge>
  }

  const getPopupStyleLabel = (style: string) => {
    switch (style) {
      case 'small': return 'Small Toast'
      case 'medium': return 'Medium Modal'
      case 'full_banner': return 'Full Banner'
      default: return style
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'every_visit': return 'Every Visit'
      case 'session': return 'Once per Session'
      case 'once_per_user': return 'Once per User'
      default: return frequency
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 md:p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No announcements yet</h3>
          <p className="text-slate-600 mb-6">
            Create your first popup announcement to engage with your website visitors.
          </p>
          <Button 
            asChild
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Link href="/admin/announcements/new">
              <Plus className="w-4 h-4 mr-2" />
              Create First Announcement
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">{announcement.title}</h3>
                  {getStatusBadge(announcement)}
                </div>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {announcement.message}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-500">Show on:</span>
                  <div className="flex gap-1">
                    {announcement.show_on_pages.map((page) => (
                      <Badge key={page} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                        {page === 'all' ? 'All Pages' : page}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Active</span>
                  <Switch 
                    checked={announcement.is_active}
                    onCheckedChange={() => handleToggleStatus(announcement)}
                    disabled={isLoading}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/admin/announcements/${announcement.id}/preview`}>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedAnnouncement(announcement)
                        setDeleteDialogOpen(true)
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-3 border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-500 mb-1">Start Date</p>
                <p className="text-slate-900">{new Date(announcement.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">End Date</p>
                <p className="text-slate-900">{announcement.end_date ? new Date(announcement.end_date).toLocaleDateString() : 'No end date'}</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">Style</p>
                <p className="text-slate-900">{getPopupStyleLabel(announcement.popup_style)}</p>
              </div>
              <div>
                <p className="font-medium text-slate-500 mb-1">Frequency</p>
                <p className="text-slate-900">{getFrequencyLabel(announcement.display_frequency)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}