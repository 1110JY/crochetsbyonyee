"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Announcement, getActiveAnnouncementsClient } from "@/lib/supabase/announcements-client"
import Image from "next/image"

interface AnnouncementPopupProps {
  className?: string
}

export function AnnouncementPopup({ className }: AnnouncementPopupProps) {
  const pathname = usePathname()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Determine current page context for targeting
  const getCurrentPageContext = () => {
    if (pathname === '/') return 'homepage'
    if (pathname.startsWith('/products')) return 'products'
    return 'other'
  }

  // Check if user should see announcement based on frequency setting
  const shouldShowAnnouncement = (announcement: Announcement) => {
    const storageKey = `announcement_${announcement.id}`
    
    switch (announcement.display_frequency) {
      case 'once_per_user':
        return !localStorage.getItem(storageKey)
      
      case 'session':
        return !sessionStorage.getItem(storageKey)
      
      case 'every_visit':
      default:
        return true
    }
  }

  // Mark announcement as seen
  const markAnnouncementAsSeen = (announcement: Announcement) => {
    const storageKey = `announcement_${announcement.id}`
    
    switch (announcement.display_frequency) {
      case 'once_per_user':
        localStorage.setItem(storageKey, Date.now().toString())
        break
      
      case 'session':
        sessionStorage.setItem(storageKey, Date.now().toString())
        break
      
      case 'every_visit':
      default:
        // No need to store anything for every visit
        break
    }
  }

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true)
      const currentPage = getCurrentPageContext()
      
      const { data } = await getActiveAnnouncementsClient(currentPage)
      
      console.log('Received announcements:', data) // Debug log
      
      if (data) {
        // Filter announcements based on frequency settings
        const visibleAnnouncements = data.filter(shouldShowAnnouncement)
        console.log('Visible announcements after filtering:', visibleAnnouncements) // Debug log
        setAnnouncements(visibleAnnouncements)
        
        if (visibleAnnouncements.length > 0) {
          console.log('Setting popup visible') // Debug log
          setIsVisible(true)
        }
      }
      setIsLoading(false)
    }

    // Don't show announcements on admin pages
    if (!pathname.startsWith('/admin')) {
      fetchAnnouncements()
    }
  }, [pathname])

  const currentAnnouncement = announcements[currentIndex]

  const handleClose = () => {
    if (currentAnnouncement) {
      markAnnouncementAsSeen(currentAnnouncement)
    }
    
    // Move to next announcement or close completely
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsVisible(false)
    }
  }

  const handleCtaClick = () => {
    if (currentAnnouncement?.cta_url) {
      if (currentAnnouncement.cta_url.startsWith('http')) {
        window.open(currentAnnouncement.cta_url, '_blank')
      } else {
        window.location.href = currentAnnouncement.cta_url
      }
    }
    handleClose()
  }

  if (isLoading || !isVisible || !currentAnnouncement) {
    return null
  }

  // Small toast style (bottom right corner)
  if (currentAnnouncement.popup_style === 'small') {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {currentAnnouncement.image_url && (
                <div className="flex-shrink-0">
                  <Image
                    src={currentAnnouncement.image_url}
                    alt={currentAnnouncement.title}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  {currentAnnouncement.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {currentAnnouncement.message}
                </p>
                {currentAnnouncement.cta_label && (
                  <Button
                    size="sm"
                    onClick={handleCtaClick}
                    className="w-full"
                  >
                    {currentAnnouncement.cta_label}
                    {currentAnnouncement.cta_url?.startsWith('http') && (
                      <ExternalLink className="w-3 h-3 ml-1" />
                    )}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full banner style (top of page)
  if (currentAnnouncement.popup_style === 'full_banner') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-purple-500 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {currentAnnouncement.image_url && (
                <Image
                  src={currentAnnouncement.image_url}
                  alt={currentAnnouncement.title}
                  width={32}
                  height={32}
                  className="rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <span className="font-semibold mr-2">
                  {currentAnnouncement.title}
                </span>
                <span className="text-sm opacity-90">
                  {currentAnnouncement.message}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentAnnouncement.cta_label && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCtaClick}
                >
                  {currentAnnouncement.cta_label}
                  {currentAnnouncement.cta_url?.startsWith('http') && (
                    <ExternalLink className="w-3 h-3 ml-1" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Medium modal style (centered)
  return (
    <Dialog open={isVisible} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">
          {currentAnnouncement.title}
        </DialogTitle>
        <div className="space-y-4">
          {currentAnnouncement.image_url && (
            <div className="w-full h-48 relative rounded-lg overflow-hidden">
              <Image
                src={currentAnnouncement.image_url}
                alt={currentAnnouncement.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold">
              {currentAnnouncement.title}
            </h2>
            <p className="text-muted-foreground">
              {currentAnnouncement.message}
            </p>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Close
            </Button>
            {currentAnnouncement.cta_label && (
              <Button
                onClick={handleCtaClick}
                className="flex-1"
              >
                {currentAnnouncement.cta_label}
                {currentAnnouncement.cta_url?.startsWith('http') && (
                  <ExternalLink className="w-4 h-4 ml-2" />
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
