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
  const { data } = await supabase.from("site_settings").select("key, value")

  if (!data) return null

  return data.reduce((acc: Partial<SiteSettings>, setting: SettingRow) => {
    acc[setting.key as keyof SiteSettings] = setting.value
    return acc
  }, {}) as SiteSettings
}
