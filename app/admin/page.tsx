import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Package, FolderOpen, MessageSquare, Star } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <h1 className="text-4xl font-serif font-light text-foreground mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-12">Overview of your crochet business</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-serif font-light">Total Products</CardTitle>
                <Package className="h-5 w-5 text-primary/60" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-light">{stats.products}</div>
                <p className="text-sm text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-serif font-light">Categories</CardTitle>
                <FolderOpen className="h-5 w-5 text-primary/60" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-light">{stats.categories}</div>
                <p className="text-sm text-muted-foreground">Product categories</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-serif font-light">Inquiries</CardTitle>
                <MessageSquare className="h-5 w-5 text-primary/60" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-light">{stats.inquiries}</div>
                <p className="text-sm text-muted-foreground">Customer messages</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-serif font-light">Testimonials</CardTitle>
                <Star className="h-5 w-5 text-primary/60" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-serif font-light">{stats.testimonials}</div>
                <p className="text-sm text-muted-foreground">Customer reviews</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Inquiries */}
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-light">Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-serif">{inquiry.name}</span>
                            {!inquiry.is_read && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{inquiry.email}</p>
                          {inquiry.subject && (
                            <p className="text-sm font-medium mb-1">{inquiry.subject}</p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No inquiries yet</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-light">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/products/new" className="block">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-primary/60" />
                        <span className="font-serif">Add New Product</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Add
                      </Badge>
                    </div>
                  </Link>

                  <Link href="/admin/categories" className="block">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="w-5 h-5 text-primary/60" />
                        <span className="font-serif">Manage Categories</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Manage
                      </Badge>
                    </div>
                  </Link>

                  <Link href="/admin/inquiries" className="block">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-primary/60" />
                        <span className="font-serif">Review Inquiries</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Review
                      </Badge>
                    </div>
                  </Link>

                  <Link href="/admin/testimonials" className="block">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-primary/60" />
                        <span className="font-serif">Moderate Testimonials</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Moderate
                      </Badge>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
