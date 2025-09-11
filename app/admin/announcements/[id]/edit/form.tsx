"use client"

import { useState, useEffect } from "react"
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
import { updateAnnouncementClient, Announcement } from "@/lib/supabase/announcements-client"
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

interface EditAnnouncementFormProps {
  announcement: Announcement
}

export function EditAnnouncementForm({ announcement }: EditAnnouncementFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>(announcement.show_on_pages)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement.title,
      message: announcement.message,
      cta_label: announcement.cta_label || "",
      cta_url: announcement.cta_url || "",
      image_url: announcement.image_url || "",
      start_date: new Date(announcement.start_date).toISOString().slice(0, 16),
      end_date: announcement.end_date ? new Date(announcement.end_date).toISOString().slice(0, 16) : "",
      show_on_pages: announcement.show_on_pages,
      display_frequency: announcement.display_frequency,
      popup_style: announcement.popup_style,
      is_active: announcement.is_active,
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
    const cleanData = {
      ...data,
      cta_label: data.cta_label || undefined,
      cta_url: data.cta_url || undefined,
      image_url: data.image_url || undefined,
      end_date: data.end_date || undefined,
    }

    const { error } = await updateAnnouncementClient(announcement.id, cleanData)
    
    if (error) {
      toast.error("Failed to update announcement")
    } else {
      toast.success("Announcement updated successfully!")
      router.push("/admin/announcements")
    }
    
    setIsLoading(false)
  }

  const availablePages = [
    { id: "all", label: "All Pages" },
    { id: "homepage", label: "Homepage" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "faq", label: "FAQ" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
            <Link href="/admin/announcements">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Announcements
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Edit Announcement</h1>
          <p className="text-slate-600 mt-1">Update your popup announcement settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-slate-600">
              The main content that will be displayed to users
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-700 font-medium">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
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
                placeholder="Enter your announcement message"
                className="min-h-[100px] border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-slate-600 mt-1">{errors.message.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta_label" className="text-slate-700 font-medium">Button Text (Optional)</Label>
                <Input
                  id="cta_label"
                  placeholder="Learn More"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
                  {...register("cta_label")}
                />
              </div>

              <div>
                <Label htmlFor="cta_url" className="text-slate-700 font-medium">Button URL (Optional)</Label>
                <Input
                  id="cta_url"
                  placeholder="https://example.com"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 placeholder:text-gray-400"
                  {...register("cta_url")}
                />
                {errors.cta_url && (
                  <p className="text-sm text-slate-600 mt-1">{errors.cta_url.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 font-medium">Image (Optional)</Label>
              <div className="mt-2">
                <ImageUpload
                  value={watchedValues.image_url}
                  onChange={(url) => setValue("image_url", url)}
                  onRemove={() => setValue("image_url", "")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Schedule
            </CardTitle>
            <CardDescription className="text-slate-600">
              When should this announcement be displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="text-slate-700 font-medium">Start Date *</Label>
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
                <Label htmlFor="end_date" className="text-slate-700 font-medium">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20"
                  {...register("end_date")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-900 rounded-full" />
              Display Settings
            </CardTitle>
            <CardDescription className="text-slate-600">
              Configure where and how often the announcement appears
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label className="text-slate-700 font-medium mb-3 block">Show on Pages *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availablePages.map((page) => (
                  <div key={page.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={page.id}
                      checked={selectedPages.includes(page.id)}
                      onCheckedChange={(checked) => 
                        handlePageSelection(page.id, checked as boolean)
                      }
                      className="border-slate-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label htmlFor={page.id} className="text-sm text-slate-700 cursor-pointer">
                      {page.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.show_on_pages && (
                <p className="text-sm text-slate-600 mt-2">{errors.show_on_pages.message}</p>
              )}
            </div>

            <div>
              <Label className="text-slate-700 font-medium">Display Frequency</Label>
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
              <Label className="text-slate-700 font-medium">Popup Style</Label>
              <Select 
                value={watchedValues.popup_style} 
                onValueChange={(value) => setValue("popup_style", value as any)}
              >
                <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-slate-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small Toast</SelectItem>
                  <SelectItem value="medium">Medium Modal</SelectItem>
                  <SelectItem value="full_banner">Full Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <Label className="text-slate-700 font-medium">Active Status</Label>
                <p className="text-sm text-slate-600 mt-1">
                  When enabled, this announcement will be shown to users
                </p>
              </div>
              <Switch
                checked={watchedValues.is_active}
                onCheckedChange={(checked) => setValue("is_active", checked)}
                className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            asChild
            className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <Link href="/admin/announcements">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Announcement
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
