"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Package, FolderOpen, MessageSquare, Star, Settings, LogOut, ShoppingCart, Users, FileText, Globe, PaintBucket, Shield, Building2, Menu, X, Megaphone } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { 
    section: "Store Management",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ]
  },
  { 
    section: "Content",
    items: [
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/blog", label: "Blog & Articles", icon: FileText },
    ]
  },
  { 
    section: "Site Settings",
    items: [
      { href: "/admin/settings", label: "General Settings", icon: Settings },
      { href: "/admin/settings/appearance", label: "Appearance", icon: PaintBucket },
      { href: "/admin/settings/social", label: "Social Media", icon: Globe },
      { href: "/admin/settings/policies", label: "Policies", icon: Shield },
    ]
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const NavContent = () => (
    <>
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Admin Panel</h2>
          <p className="text-xs text-slate-500">Crochets by On-Yee</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={item.section} className="pt-4 first:pt-0">
                <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  {item.section}
                </h3>
                <div className="space-y-1">
                  {item.items?.map((subItem) => {
                    const Icon = subItem.icon
                    const isActive = pathname === subItem.href

                    return (
                      <Link key={subItem.href} href={subItem.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm font-medium ${
                            isActive 
                              ? "bg-slate-100 text-slate-900" 
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {subItem.label}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          } else if (item.href) {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm font-medium ${
                    isActive 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            )
          }
          return null
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <Button
          onClick={() => {
            handleSignOut()
            setIsMobileMenuOpen(false)
          }}
          variant="ghost"
          className="w-full justify-start text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Navigation Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/90 backdrop-blur-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Navigation Sidebar */}
      <div className={`md:hidden fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 md:p-6">
          <NavContent />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="w-64 bg-white border-r border-slate-200 min-h-screen hidden md:block">
        <div className="p-4 md:p-6">
          <NavContent />
        </div>
      </div>
    </>
  )
}
