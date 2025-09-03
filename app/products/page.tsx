import { Navigation } from "@/components/navigation"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { getProducts, getCategories } from "@/lib/supabase/products"

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

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
              Collection
            </h1>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {products.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-3xl font-serif font-light text-foreground">Our Handmade Treasures</h2>
                  </div>
                  <CategoryFilter categories={categories} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                  </div>
                  <h3 className="text-3xl font-serif font-light text-foreground mb-6">Coming Soon</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    We're carefully curating our collection of beautiful handmade items. Each piece is crafted with 
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

        {/* Featured Categories Section */}
        {categories.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-light text-foreground mb-6">Explore by Category</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.slice(0, 6).map((category) => (
                  <div key={category.id} className="group cursor-pointer">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={category.image_url || "/placeholder.svg?height=300&width=300&query=crochet"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                    <h3 className="text-xl font-serif font-light text-center text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground text-center mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}