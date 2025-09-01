import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { getFeaturedProducts, getCategories } from "@/lib/supabase/products"

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Batch style full-screen */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 text-balance">Crochets by On-Yee</h1>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent px-12 py-6 text-lg font-light"
          >
            <Link href="/products">View Collection</Link>
          </Button>
        </div>

        {/* Bottom navigation like Batch theme */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/60">
          <div className="text-sm">© 2025 All rights reserved.</div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Powered by Crochets by On-Yee</span>
              <div className="flex space-x-3">
                <a
                  href="https://www.tiktok.com/@crochetsbyonyee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiTiktok className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </a>

                <a
                  href="https://www.instagram.com/crochetsbyonyee/"
                  target="_blank"
                  rel="noopener noreferrer"
                >   
                  <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </a>
              </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid - Batch style */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-foreground mb-6">Currently Serving</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category) => (
              <div key={category.id} className="group cursor-pointer">
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white text-white hover:bg-white/10 bg-transparent"
                      >
                        View Products
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-light text-center text-foreground">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Batch style minimal */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-light text-foreground mb-8">About Our Craft</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
            Each piece is meticulously handcrafted with premium materials and years of expertise. We believe in creating
            timeless treasures that bring joy and comfort to your everyday life.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-12"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Inline Footer */}
      <footer className="py-8 px-6 lg:px-8 bg-background text-center text-sm text-muted-foreground">
        © 2025 All rights reserved. Powered by Crochets by On-Yee.
      </footer>
    </div>
  )
}
