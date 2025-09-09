"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  content: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review too long"),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export function ReviewDialog() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
      customerName: "",
      email: "",
    },
  })

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    console.log("Files selected:", files.length, files)
    
    if (selectedImages.length + files.length > 3) {
      toast({
        variant: "error",
        title: "Too many images",
        description: "You can upload a maximum of 3 images",
      })
      return
    }
    
    // Validate file types
    const validFiles = files.filter(file => {
      if (file.type.startsWith('image/')) {
        return true
      } else {
        console.warn(`Skipping non-image file: ${file.name}`)
        return false
      }
    })
    
    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles])
      console.log("Images added, total count:", selectedImages.length + validFiles.length)
      
      toast({
        variant: "success",
        title: "Images added",
        description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} selected successfully`,
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ReviewFormData) => {
    console.log("=== Form submission started ===")
    setIsSubmitting(true)
    try {
      // Create FormData to handle file uploads
      const formData = new FormData()
      formData.append('rating', rating.toString())
      formData.append('title', data.title || '')
      formData.append('content', data.content)
      formData.append('customerName', data.customerName)
      formData.append('email', data.email)
      
      console.log("Form data prepared:", {
        rating: rating.toString(),
        title: data.title,
        content: data.content,
        customerName: data.customerName,
        email: data.email,
        imageCount: selectedImages.length
      })

      // Submit review to API
      console.log("Sending request to /api/submit-review")
      const response = await fetch("/api/submit-review", {
        method: "POST",
        body: formData,
      })

      console.log("Response received:", { status: response.status, ok: response.ok })
      
      const result = await response.json()
      console.log("API Response:", { status: response.status, result })

      if (!response.ok) {
        console.error("API Error:", result)
        const errorMessage = result.error || result.details || `Server error: ${response.status}`
        throw new Error(errorMessage)
      }
      
      // Reset form and close dialog
      form.reset()
      setRating(0)
      setSelectedImages([])
      setOpen(false)
      
      // Show success message 
      toast({
        variant: "success",
        title: "Review submitted!",
        description: "Your review has been submitted and will be published after moderation.",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        variant: "error",
        title: "Failed to submit review",
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
        >
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Share Your Experience</DialogTitle>
          <DialogDescription>
            Help others discover our handmade treasures by sharing your honest review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            setRating(star)
                            field.onChange(star)
                          }}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-muted-foreground">
                        {rating > 0 && (
                          <>
                            {rating} star{rating !== 1 ? "s" : ""}
                          </>
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Summarize your experience in a few words"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your experience with our products. What did you love? How was the quality?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="How should we display your name?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your.email@example.com (won't be displayed publicly)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-nunito">
                Photos (optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload images (up to 3)
                  </span>
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-border"
                        onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                        onError={() => console.error(`Failed to load image ${index + 1}`)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
