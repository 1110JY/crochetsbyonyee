import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.log("No user found, redirecting to login")
    redirect("/auth/login")
  }

  console.log("User found:", data.user.email)

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-xl text-red-600 mb-4">Error Loading Profile</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ error: profileError, user: data.user }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  console.log("Profile found:", profile)

  if (profile?.role === "admin") {
    console.log("Admin user detected, redirecting to admin")
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
