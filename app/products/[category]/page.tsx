import { Navigation } from "@/components/navigation"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { Badge } from "@/components/ui/badge"
import { getProducts, getCategories } from "@/lib/supabase/products"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const [products, categories] = await Promise.all([getProducts(category), getCategories()])

  // Find the current category
  const currentCategory = categories.find((cat) => cat.slug === category)

  if (!currentCategory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section with Gradient */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-accent to-secondary">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-balance">
              {currentCategory.name}
            </h1>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with filter - always visible */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-3xl font-serif font-light text-foreground">Our Handmade Treasures</h2>
              </div>
              <CategoryFilter categories={categories} currentCategory={category} />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                  </div>
                  <h3 className="text-3xl font-serif font-light text-foreground mb-6">Coming Soon</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    We're carefully curating our collection of {currentCategory.name.toLowerCase()}. Each piece is crafted with 
                    love and attention to detail, and we can't wait to share them with you.
                  </p>
                  <p className="text-muted-foreground">
                    Check back soon or follow us on social media for updates on new arrivals!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
