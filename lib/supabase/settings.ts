import { createClient } from "./server"

export interface SiteSettings {
  site_title: string
  site_description: string
  hero_title: string
  hero_subtitle: string
  contact_email: string
  phone_number: string
  address: string
  social_instagram: string
  social_facebook: string
  about_text: string
}

interface SettingRow {
  key: string
  value: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  
  // Add cache busting by including current timestamp in query
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .gte('created_at', '1970-01-01') // Always true condition to bust cache

  if (error) {
    console.error("Error fetching site settings:", error)
    return null
  }

  if (!data) {
    return null
  }

  return data.reduce((acc: Partial<SiteSettings>, setting: SettingRow) => {
    acc[setting.key as keyof SiteSettings] = setting.value
    return acc
  }, {}) as SiteSettings
}
