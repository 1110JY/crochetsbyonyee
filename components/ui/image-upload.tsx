"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  disabled, 
  className 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `announcement_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('announcement-images')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('announcement-images')
        .getPublicUrl(fileName)

      if (urlData?.publicUrl) {
        onChange(urlData.publicUrl)
      } else {
        throw new Error('Failed to get public URL')
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      const supabase = createClient()
      
      // Extract filename from URL
      const url = new URL(value)
      const fileName = url.pathname.split('/').pop()
      
      if (fileName) {
        // Delete from storage
        await supabase.storage
          .from('announcement-images')
          .remove([fileName])
      }
    } catch (error) {
      console.error('Error removing image:', error)
    }

    onRemove()
  }

  return (
    <div className={className}>
      <Label className="text-slate-700 font-medium">Announcement Image</Label>
      
      {value ? (
        <div className="mt-2 space-y-3">
          <div className="relative w-full h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <Image
              src={value}
              alt="Announcement preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            Click the X button to remove this image
          </p>
        </div>
      ) : (
        <div className="mt-2">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploading}
                  className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {uploadError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{uploadError}</p>
        </div>
      )}

      <p className="text-sm text-slate-500 mt-2">
        This image will appear in your announcement popup. Recommended size: 400x200px or similar aspect ratio.
      </p>
    </div>
  )
}
