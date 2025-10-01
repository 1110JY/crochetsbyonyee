import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// removed unused icon imports that are client-only to avoid SSR issues
import { getFeaturedProducts, getCategories } from "@/lib/supabase/products"
import { getSiteSettings } from "@/lib/supabase/settings"
import { getTestimonials } from "@/lib/supabase/testimonials"
// Inline SVG star to avoid importing client-only icon libs into a server component
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}
import { ReviewSection } from "@/components/review-section"
import { FadeIn, ScrollReveal } from "@/components/animations"

export const revalidate = 0 // Disable cache for this page
export const dynamic = 'force-dynamic' // Force dynamic rendering

export default async function HomePage() {
  const [featuredProducts, categories, settings, testimonials] = await Promise.all([
    getFeaturedProducts(), 
    getCategories(),
    getSiteSettings(),
    getTestimonials(6) // Get up to 6 featured testimonials
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Batch style full-screen */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-pink-200 to-purple-300">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <FadeIn delay={0.2} duration={0.6}>
            <h1 className="text-6xl md:text-8xl font-mochiy font-normal mb-10 text-balance">
              {settings?.hero_title || "Crochets by On-Yee"}
            </h1>
          </FadeIn>
          <FadeIn delay={0.4} duration={0.6}>
            {settings?.hero_subtitle && (
              <p className="text-xl md:text-2xl font-mochiy-p mb-8 text-white/90">
                {settings.hero_subtitle}
              </p>
            )}
          </FadeIn>
          <FadeIn delay={0.6} duration={0.6}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent px-12 py-6 text-lg font-light rounded-full"
            >
              <Link href="/products">View Collection</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Featured Products Grid - Batch style */}
      <section className="py-20 px-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mochiy font-light text-foreground mb-6">Currently Serving</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <ScrollReveal key={category.id} delay={index * 0.1} duration={0.6}>
                <div className="group cursor-pointer">
                  <Link href={`/products/${category.slug}`}>
                    <div className="relative aspect-square mb-6 overflow-hidden bg-muted">
                      <img
                        src={category.image_url || "/placeholder.svg?height=400&width=400&query=crochet"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 bg-background/30 backdrop-blur-[2px] border-primary/20 hover:border-primary/30 text-primary hover:text-primary hover:bg-background/40 rounded-full"
                        >
                          View Products
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-2xl font-mochiy font-light text-center text-foreground">{category.name}</h3>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Batch style minimal */}
      <section className="py-20 px-10 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl font-mochiy font-light text-foreground mb-8">About Our Craft</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto font-mochiy-p">
              Each piece is meticulously handcrafted with premium materials and years of expertise. I make every piece by hand, using soft, quality yarns. The goal? To give you something cozy and cheerful that lasts.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-12 rounded-full"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mochiy font-light text-foreground mb-4">Customer Stories</h2>
              <p className="text-lg text-muted-foreground font-mochiy-p">What our customers say about their experience</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.filter(t => t.is_published).slice(0, 6).map((testimonial, index) => {
              // Split content into title and description if it contains line breaks
              const contentParts = testimonial.content.split('\n\n')
              const hasTitle = contentParts.length > 1
              const title = hasTitle ? contentParts[0] : null
              const description = hasTitle ? contentParts[1] : testimonial.content
              
              return (
                <ScrollReveal key={testimonial.id} delay={index * 0.1} duration={0.6}>
                  <div className="bg-white/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
                    <div className="mb-4">
                      <h4 className="font-mochiy text-foreground mb-2">{testimonial.customer_name}</h4>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      {title && (
                        <h5 className="font-medium text-foreground mb-2 font-mochiy">{title}</h5>
                      )}
                      <p className="text-muted-foreground leading-relaxed italic font-mochiy-p">"{description}"</p>
                      
                      {/* Display review images if any */}
                      {testimonial.images && testimonial.images.length > 0 && (
                        <div className="mt-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {testimonial.images.slice(0, 3).map((imageUrl: string, index: number) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                <img 
                                  src={imageUrl} 
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    console.warn(`Failed to load image: ${imageUrl}`)
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          <div className="text-center mt-12">
          </div>
        </div>
      </section>

      {/* Review Section */}
      <ScrollReveal>
        <ReviewSection />
      </ScrollReveal>

      {/* Inline Footer */}
      <ScrollReveal>
        <footer className="py-8 px-6 lg:px-8 bg-background text-center text-sm text-muted-foreground font-nunito">
          © 2025 All rights reserved. Powered by Crochets by On-Yee.
        </footer>
      </ScrollReveal>
    </div>
  )
}
