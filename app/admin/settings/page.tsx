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
  phone_number: string
  address: string
  social_instagram: string
  social_tiktok: string
  hero_title: string
  hero_subtitle: string
  about_text: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "",
    site_description: "",
    contact_email: "",
    phone_number: "",
    address: "",
    social_instagram: "",
    social_tiktok: "",
    hero_title: "",
    hero_subtitle: "",
    about_text: "",
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader title="Site Settings" description="Manage your website content and configuration" />

      <div className="max-w-4xl mx-auto px-8">
        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center font-serif font-light">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_title" className="text-foreground">
                    Site Title
                  </Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => handleChange("site_title", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email" className="text-foreground">
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="site_description" className="text-foreground">
                  Site Description
                </Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => handleChange("site_description", e.target.value)}
                  className="border-primary/20 focus:border-primary/30"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-foreground font-serif font-light">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero_title" className="text-foreground">
                  Hero Title
                </Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  className="border-primary/20 focus:border-primary/30"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle" className="text-foreground">
                  Hero Subtitle
                </Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  className="border-primary/20 focus:border-primary/30"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-foreground font-serif font-light">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_number" className="text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    value={settings.phone_number}
                    onChange={(e) => handleChange("phone_number", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-foreground font-serif font-light">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="social_instagram" className="text-foreground">
                    Instagram URL
                  </Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <Label htmlFor="social_tiktok" className="text-foreground">
                    TikTok URL
                  </Label>
                  <Input
                    id="social_tiktok"
                    value={settings.social_tiktok}
                    onChange={(e) => handleChange("social_tiktok", e.target.value)}
                    className="border-primary/20 focus:border-primary/30"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-foreground font-serif font-light">About Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="about_text" className="text-foreground">
                  About Text
                </Label>
                <Textarea
                  id="about_text"
                  value={settings.about_text}
                  onChange={(e) => handleChange("about_text", e.target.value)}
                  className="border-primary/20 focus:border-primary/30"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary/90 hover:bg-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
