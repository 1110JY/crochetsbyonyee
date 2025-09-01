import type React from "react"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/lib/supabase/admin"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAdmin = await checkAdminAccess()

  if (!isAdmin) {
    redirect("/protected")
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
