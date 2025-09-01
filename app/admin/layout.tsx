import type React from "react"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/lib/supabase/admin"
import { AdminNav } from "@/components/admin/admin-nav"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl text-red-600 mb-4">Authentication Error</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ error: userError, user }, null, 2)}
          </pre>
          <a href="/auth/login" className="mt-4 inline-block bg-amber-600 text-white px-4 py-2 rounded">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || profileError) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl text-red-600 mb-4">Profile Error</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ error: profileError, profile, user: user.email }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl text-red-600 mb-4">Access Denied</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              userEmail: user.email,
              userId: user.id,
              role: profile.role,
              message: "User does not have admin privileges"
            }, null, 2)}
          </pre>
          <a href="/protected" className="mt-4 inline-block bg-amber-600 text-white px-4 py-2 rounded">
            Go to Protected Page
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-amber-50">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
