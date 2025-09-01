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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-amber-100 text-amber-800 border-amber-200">
            {currentCategory.name}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 text-balance">{currentCategory.name}</h1>
          {currentCategory.description && (
            <p className="text-xl text-amber-700 mb-8 text-pretty">{currentCategory.description}</p>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter categories={categories} currentCategory={category} />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🧶</span>
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4">No Products in This Category</h3>
              <p className="text-amber-700 max-w-md mx-auto">
                We're working on adding beautiful {currentCategory.name.toLowerCase()} to our collection. Check back
                soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Inline Footer */}
      <footer className="bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-700">© 2023 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
