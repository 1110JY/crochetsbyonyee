"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { createAnnouncementClient, CreateAnnouncementData } from "@/lib/supabase/announcements-client"
import { ImageUpload } from "@/components/ui/image-upload"
import Link from "next/link"

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
  cta_label: z.string().optional(),
  cta_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  show_on_pages: z.array(z.string()).min(1, "Select at least one page"),
  display_frequency: z.enum(["every_visit", "session", "once_per_user"]),
  popup_style: z.enum(["small", "medium", "full_banner"]),
  is_active: z.boolean(),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

export function NewAnnouncementForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>(["all"])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      cta_label: "",
      cta_url: "",
      image_url: "",
      start_date: new Date().toISOString().slice(0, 16),
      end_date: "",
      show_on_pages: ["all"],
      display_frequency: "session",
      popup_style: "medium",
      is_active: true,
    },
  })

  const watchedValues = watch()

  const handlePageSelection = (page: string, checked: boolean) => {
    let newPages: string[]
    
    if (page === "all") {
      newPages = checked ? ["all"] : []
    } else {
      const currentPages = selectedPages.filter(p => p !== "all")
      if (checked) {
        newPages = [...currentPages, page]
      } else {
        newPages = currentPages.filter(p => p !== page)
      }
    }
    
    setSelectedPages(newPages)
    setValue("show_on_pages", newPages)
  }

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsLoading(true)
    
    // Clean up empty optional fields
    const cleanData: CreateAnnouncementData = {
      ...data,
      cta_label: data.cta_label || undefined,
      cta_url: data.cta_url || undefined,
      image_url: data.image_url || undefined,
      end_date: data.end_date || undefined,
    }

    const { error } = await createAnnouncementClient(cleanData)
    
    if (error) {
      toast.error("Failed to create announcement")
      console.error("Create announcement error:", error)
    } else {
      toast.success("Announcement created successfully!")
      router.push("/admin/announcements")
    }
    
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/announcements">
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Announcements
          </Button>
        </Link>
      </div>

      {/* Core Fields */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Core Information</h2>
          <p className="text-slate-600 text-sm mt-1">Basic details for your announcement</p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-slate-700 font-medium">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Back to School Sale 🎒"
              className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-slate-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="text-slate-700 font-medium">Message *</Label>
            <Textarea
              id="message"
              placeholder="e.g., Get 15% off all scarves until Sept 30th. Use code SCHOOL15 at checkout."
              rows={4}
              className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-slate-600 mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta_label" className="text-slate-700 font-medium">Call-to-Action Button Label</Label>
              <Input
                id="cta_label"
                placeholder="e.g., Shop Now, Learn More"
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
                {...register("cta_label")}
              />
            </div>
            <div>
              <Label htmlFor="cta_url" className="text-slate-700 font-medium">Call-to-Action URL</Label>
              <Input
                id="cta_url"
                placeholder="e.g., /products/scarves"
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
                {...register("cta_url")}
              />
              {errors.cta_url && (
                <p className="text-sm text-slate-600 mt-1">{errors.cta_url.message}</p>
              )}
            </div>
          </div>

          <ImageUpload
            value={watchedValues.image_url}
            onChange={(url) => setValue("image_url", url)}
            onRemove={() => setValue("image_url", "")}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Display Settings</h2>
          <p className="text-slate-600 text-sm mt-1">Control when and where your announcement appears</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-slate-700 font-medium">Start Date & Time *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                {...register("start_date")}
              />
              {errors.start_date && (
                <p className="text-sm text-slate-600 mt-1">{errors.start_date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="end_date" className="text-slate-700 font-medium">End Date & Time (Optional)</Label>
              <Input
                id="end_date"
                type="datetime-local"
                className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                {...register("end_date")}
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-700 font-medium">Show on Pages *</Label>
            <div className="space-y-2 mt-2">
              {[
                { value: "all", label: "All Pages" },
                { value: "homepage", label: "Homepage Only" },
                { value: "products", label: "Product Pages Only" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`page-${option.value}`}
                    checked={selectedPages.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handlePageSelection(option.value, checked as boolean)
                    }
                    className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <Label htmlFor={`page-${option.value}`} className="text-slate-700">{option.label}</Label>
                </div>
              ))}
            </div>
            {errors.show_on_pages && (
              <p className="text-sm text-slate-600 mt-1">{errors.show_on_pages.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="display_frequency" className="text-slate-700 font-medium">Display Frequency</Label>
            <Select
              value={watchedValues.display_frequency}
              onValueChange={(value) => setValue("display_frequency", value as any)}
            >
              <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="every_visit">Every Visit</SelectItem>
                <SelectItem value="session">Once per Session</SelectItem>
                <SelectItem value="once_per_user">Once per User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="popup_style" className="text-slate-700 font-medium">Popup Style</Label>
            <Select
              value={watchedValues.popup_style}
              onValueChange={(value) => setValue("popup_style", value as any)}
            >
              <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small Toast (Bottom Corner)</SelectItem>
                <SelectItem value="medium">Medium Modal (Centered)</SelectItem>
                <SelectItem value="full_banner">Full Banner (Top/Bottom)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watchedValues.is_active}
              onCheckedChange={(checked) => setValue("is_active", checked)}
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-200"
            />
            <Label htmlFor="is_active" className="text-slate-700">Active (announcement will be shown)</Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Link href="/admin/announcements">
          <Button variant="outline" type="button" className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
            Cancel
          </Button>
        </Link>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isLoading ? (
            "Creating..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Announcement
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
