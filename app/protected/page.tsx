import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role === "admin") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Welcome!</h1>
        <p className="text-amber-700 mb-6">
          You're successfully logged in. Thank you for being part of our crochet community!
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
          >
            Browse Products
          </a>
          <a
            href="/contact"
            className="block w-full border border-amber-600 text-amber-600 px-4 py-2 rounded-md hover:bg-amber-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
