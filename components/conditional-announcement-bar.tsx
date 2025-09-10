"use client"

import { usePathname } from "next/navigation"
import { AnnouncementBar } from "./announcement-bar"
import { AnnouncementPopup } from "./announcement-popup"

export function ConditionalAnnouncementBar() {
  const pathname = usePathname()
  
  // Don't show announcements on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return (
    <>
      <AnnouncementBar />
      <AnnouncementPopup />
    </>
  )
}
