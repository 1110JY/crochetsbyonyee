import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Package, FolderOpen, MessageSquare, Star, ShoppingCart, Users, TrendingUp, Activity, Plus, Eye, Calendar, Clock } from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: inquiriesCount },
    { count: testimonialsCount },
    { count: unreadInquiriesCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
  ])

  return {
    products: productsCount || 0,
    categories: categoriesCount || 0,
    inquiries: inquiriesCount || 0,
    testimonials: testimonialsCount || 0,
    unreadInquiries: unreadInquiriesCount || 0,
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

async function getRecentTestimonials() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentInquiries, recentTestimonials] = await Promise.all([
    getDashboardStats(), 
    getRecentInquiries(),
    getRecentTestimonials()
  ])

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button size="sm" variant="outline" asChild className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              <Link href="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.products}</div>
            <p className="text-xs text-slate-600">Active listings</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.categories}</div>
            <p className="text-xs text-slate-600">Product collections</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Customer Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.inquiries}</div>
            <p className="text-xs text-slate-600">
              {stats.unreadInquiries > 0 && (
                <span className="text-orange-600 font-medium">{stats.unreadInquiries} unread</span>
              )}
              {stats.unreadInquiries === 0 && "All caught up"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Testimonials</CardTitle>
            <Star className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.testimonials}</div>
            <p className="text-xs text-slate-600">Customer reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2 bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Inquiries</CardTitle>
            <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              <Link href="/admin/inquiries">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-900 truncate">{inquiry.name}</span>
                      {!inquiry.is_read && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs border-orange-200">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{inquiry.email}</p>
                    {inquiry.subject && (
                      <p className="text-sm font-medium text-slate-800 mb-1 truncate">{inquiry.subject}</p>
                    )}
                    <p className="text-sm text-slate-600 line-clamp-2">{inquiry.message}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <span className="text-xs text-slate-500">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(inquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p>No inquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/products/new" className="block">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Package className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Add New Product</span>
              </div>
            </Link>

            <Link href="/admin/categories" className="block">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <FolderOpen className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Manage Categories</span>
              </div>
            </Link>

            <Link href="/admin/inquiries" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Review Inquiries</span>
                </div>
                {stats.unreadInquiries > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                    {stats.unreadInquiries}
                  </Badge>
                )}
              </div>
            </Link>

            <Link href="/admin/testimonials" className="block">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Star className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Manage Testimonials</span>
              </div>
            </Link>

            <Link href="/admin/settings" className="block">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Activity className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Site Settings</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Testimonials */}
      {recentTestimonials.length > 0 && (
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Testimonials</CardTitle>
            <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
              <Link href="/admin/testimonials">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-slate-900">{testimonial.customer_name}</span>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{testimonial.content}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
