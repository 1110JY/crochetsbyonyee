import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Package, FolderOpen, MessageSquare, Star } from "lucide-react"

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: inquiriesCount },
    { count: testimonialsCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
  ])

  return {
    products: productsCount || 0,
    categories: categoriesCount || 0,
    inquiries: inquiriesCount || 0,
    testimonials: testimonialsCount || 0,
  }
}

async function getRecentInquiries() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentInquiries] = await Promise.all([getDashboardStats(), getRecentInquiries()])

  return (
    <div>
      <AdminHeader title="Dashboard" description="Overview of your crochet business" />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Total Products</CardTitle>
              <Package className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{stats.products}</div>
              <p className="text-xs text-amber-600">Active listings</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{stats.categories}</div>
              <p className="text-xs text-amber-600">Product categories</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{stats.inquiries}</div>
              <p className="text-xs text-amber-600">Customer messages</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">Testimonials</CardTitle>
              <Star className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{stats.testimonials}</div>
              <p className="text-xs text-amber-600">Customer reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-start justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-amber-900">{inquiry.name}</span>
                          {!inquiry.is_read && <Badge className="bg-amber-600 text-white text-xs">New</Badge>}
                        </div>
                        <p className="text-sm text-amber-700 mb-1">{inquiry.email}</p>
                        {inquiry.subject && (
                          <p className="text-sm font-medium text-amber-800 mb-1">{inquiry.subject}</p>
                        )}
                        <p className="text-sm text-amber-600 line-clamp-2">{inquiry.message}</p>
                      </div>
                      <span className="text-xs text-amber-500">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-600 text-center py-4">No inquiries yet</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-900">Add New Product</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    Create
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-900">Manage Categories</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    Edit
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-900">Review Inquiries</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    Review
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-900">Manage Testimonials</span>
                  </div>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    Moderate
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
