import type React from "react"
import { redirect } from "next/navigation"
import { checkAdminAccess } from "@/lib/supabase/admin"
import { AdminNav } from "@/components/admin/admin-nav"
import { createClient } from "@/lib/supabase/server"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-slate-200">
          <h1 className="text-xl text-slate-900 mb-4">Authentication Error</h1>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-slate-700">
            {JSON.stringify({ error: userError, user }, null, 2)}
          </pre>
          <a href="/auth/login" className="mt-4 inline-block bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded">
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
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-slate-200">
          <h1 className="text-xl text-slate-900 mb-4">Profile Error</h1>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-slate-700">
            {JSON.stringify({ error: profileError, profile, user: user.email }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-slate-200">
          <h1 className="text-xl text-slate-900 mb-4">Access Denied</h1>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-slate-700">
            {JSON.stringify({
              userEmail: user.email,
              userId: user.id,
              role: profile.role,
              message: "User does not have admin privileges"
            }, null, 2)}
          </pre>
          <a href="/protected" className="mt-4 inline-block bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded">
            Go to Protected Page
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen bg-slate-50 ${inter.className}`}>
      <AdminNav />
      <div className="flex-1 md:ml-0">{children}</div>
    </div>
  )
}
