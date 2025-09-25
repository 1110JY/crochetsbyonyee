"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Save, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface SiteSettings {
  site_title: string
  site_description: string
  contact_email: string
  social_instagram: string
  social_tiktok: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "",
    site_description: "",
    contact_email: "",
    social_instagram: "",
    social_tiktok: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("site_settings").select("key, value")

    if (data) {
      const settingsObj = data.reduce((acc, setting) => {
        acc[setting.key as keyof SiteSettings] = setting.value || ""
        return acc
      }, {} as SiteSettings)
      setSettings(settingsObj)
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        const { error } = await supabase.from("site_settings").upsert(update, { onConflict: "key" })
        if (error) throw error
      }

      // Revalidate all pages that might use these settings
      try {
        const res = await fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paths: ["/", "/about", "/contact", "/products"]
          })
        });
        if (!res.ok) throw new Error("Failed to revalidate");
        console.log("Pages revalidated successfully");
      } catch (e) {
        console.error("Failed to revalidate pages:", e);
      }

      // Also force refresh the current page cache
      router.refresh()

      toast({
        variant: "success",
        title: "Settings saved!",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "error",
        title: "Failed to save settings",
        description: "There was an error saving your settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Site Settings" description="Manage your website content and configuration" />
        <div className="p-6">
          <div className="text-center py-8">Loading settings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-6">
        <div className="max-w-full">
          <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Site Settings</h1>
                <p className="text-slate-600 mt-1">Manage your website content and configuration</p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>

            {/* Settings content */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-1 gap-6">
                {/* General Settings */}
                <div className="bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site_title" className="text-slate-900 mb-1">Site Title</Label>
                      <Input
                        id="site_title"
                        value={settings.site_title}
                        onChange={(e) => handleChange("site_title", e.target.value)}
                        className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email" className="text-slate-900 mb-1">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="site_description" className="text-slate-900 mb-1">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={settings.site_description}
                      onChange={(e) => handleChange("site_description", e.target.value)}
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 text-slate-900"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="social_instagram" className="text-slate-900 mb-1">Instagram URL</Label>
                      <Input
                        id="social_instagram"
                        value={settings.social_instagram}
                        onChange={(e) => handleChange("social_instagram", e.target.value)}
                        className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 text-slate-900"
                        placeholder="https://www.instagram.com/youraccount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_tiktok" className="text-slate-900 mb-1">TikTok URL</Label>
                      <Input
                        id="social_tiktok"
                        value={settings.social_tiktok}
                        onChange={(e) => handleChange("social_tiktok", e.target.value)}
                        className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 placeholder:text-gray-400 text-slate-900"
                        placeholder="https://www.tiktok.com/@youraccount"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
